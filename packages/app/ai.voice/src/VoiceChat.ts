import { OpenAIClient } from './api/OpenAIClient'
import { DataChannelHandler } from './messaging/DataChannelHandler'
import { NavigationHandler } from './navigation/NavigationHanlder'
import { Logger } from './utils/Logger'
import { VoiceConnection } from './webrtc/VoiceConnection'

export class VoiceChat {
  private voiceConnection: VoiceConnection
  private dataChannelHandler: DataChannelHandler
  private logger: Logger
  private openAIClient: OpenAIClient
  private navigationHandler: NavigationHandler
  private isRecording: boolean = false
  private recordButton: HTMLButtonElement
  private audioContainer: HTMLDivElement

  constructor() {
    // Initialize DOM elements
    this.recordButton = document.querySelector<HTMLButtonElement>('#recordButton')!
    this.audioContainer = document.querySelector<HTMLDivElement>('#audioContainer')!

    // Initialize services
    this.navigationHandler = new NavigationHandler()
    this.voiceConnection = new VoiceConnection()
    this.dataChannelHandler = new DataChannelHandler(this.voiceConnection.getDataChannel())
    this.logger = new Logger('#logs')
    this.openAIClient = new OpenAIClient(import.meta.env.OPENAI_API_KEY)

    // Setup handlers
    this.setupDataChannelHandler()
    this.setupRecordButton()
    this.voiceConnection.setupAudioHandling(this.audioContainer)
  }

  private setupDataChannelHandler() {
    this.dataChannelHandler.setupMessageHandler(async (message) => {
      if (message.type === 'response.function_call_arguments.done') {
        try {
          this.logger.log(message.name!, message.arguments!)

          // Handle navigation tool separately
          if (message.name === 'next-page') {
            const result = this.navigationHandler.runNavigationTool()
            this.logger.addResult(result)

            if (result.result === 'success') {
              // Update session with new page tools after navigation
              const sessionUpdate = this.dataChannelHandler.updateSession(this.getTools())
              this.dataChannelHandler.sendMessage(sessionUpdate)
            }

            const responses = this.dataChannelHandler.createFunctionCallResponse(
              message.call_id!,
              result
            )
            responses.forEach((response) => this.dataChannelHandler.sendMessage(response))
            return
          }

          // Handle page-specific tools
          const result = await this.navigationHandler
            .getCurrentPage()
            .runTool(message.name!, JSON.parse(message.arguments!))
          this.logger.addResult(result)

          const responses = this.dataChannelHandler.createFunctionCallResponse(
            message.call_id!,
            result
          )
          responses.forEach((response) => this.dataChannelHandler.sendMessage(response))
        } catch (error) {
          console.error('Error running tool:', error)
          this.logger.addError(error)
        }
      }
    })
  }

  private getTools() {
    const currentPage = this.navigationHandler.getCurrentPage()
    return [...currentPage.getTools(), this.navigationHandler.getNavigationTool()]
  }

  private setupRecordButton() {
    this.recordButton.addEventListener('click', () => this.toggleRecording())
  }

  private async toggleRecording() {
    if (!this.isRecording) {
      await this.startRecording()
    } else {
      await this.stopRecording()
    }
    this.isRecording = !this.isRecording
    this.recordButton.textContent = this.isRecording ? 'Stop Recording' : 'Start Recording'
  }

  private async startRecording() {
    try {
      const offer = await this.voiceConnection.startStream()
      const { client_secret } = await this.openAIClient.createSession(
        this.navigationHandler.getCurrentPage().getInstructions()
      )
      const answer = await this.openAIClient.getAnswer(client_secret.value, offer.sdp!)
      await this.voiceConnection.setRemoteDescription(answer)

      this.dataChannelHandler.onOpen(() => {
        const sessionUpdate = this.dataChannelHandler.updateSession(this.getTools())
        this.dataChannelHandler.sendMessage(sessionUpdate)
      })
    } catch (error) {
      console.error('Error starting recording:', error)
      this.logger.warn('Failed to start recording')
      alert('Failed to start recording. Please check console for details.')
    }
  }

  private async stopRecording() {
    this.voiceConnection.close()
    this.voiceConnection = this.voiceConnection.createNew()
    this.dataChannelHandler = new DataChannelHandler(this.voiceConnection.getDataChannel())
    this.setupDataChannelHandler()
  }
}
