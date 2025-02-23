import { IPage } from 'features__shared__views.ai.voice/interfaces'
import { AuthPage } from 'features__user__views.ai.voice/pages'
import './style.css'

class VoiceChat {
  private peerConnection: RTCPeerConnection
  private dataChannel: RTCDataChannel
  private isRecording: boolean = false
  private recordButton: HTMLButtonElement
  private audioContainer: HTMLDivElement
  private logsContainer: HTMLDivElement
  private currentPage: IPage

  constructor() {
    this.currentPage = new AuthPage()
    this.recordButton = document.querySelector<HTMLButtonElement>('#recordButton')!
    this.audioContainer = document.querySelector<HTMLDivElement>('#audioContainer')!
    this.logsContainer = document.querySelector<HTMLDivElement>('#logs')!

    this.peerConnection = new RTCPeerConnection()
    this.dataChannel = this.peerConnection.createDataChannel('oai-events')

    this.setupAudioHandling()
    this.setupDataChannel()
    this.setupRecordButton()
  }

  private setupAudioHandling() {
    this.peerConnection.ontrack = (event) => {
      const audioElement = document.createElement('audio')
      audioElement.srcObject = event.streams[0]
      audioElement.autoplay = true
      audioElement.controls = true
      this.audioContainer.innerHTML = ''
      this.audioContainer.appendChild(audioElement)
    }
  }

  private addLogEntry(functionName: string, args: string, result?: unknown) {
    const logEntry = document.createElement('div')
    logEntry.className = 'log-entry'

    const timestamp = document.createElement('div')
    timestamp.className = 'timestamp'
    timestamp.textContent = new Date().toLocaleTimeString()

    const name = document.createElement('div')
    name.className = 'function-name'
    name.textContent = `Function: ${functionName}`

    const argsElement = document.createElement('pre')
    argsElement.textContent = `Arguments: ${args}`

    logEntry.appendChild(timestamp)
    logEntry.appendChild(name)
    logEntry.appendChild(argsElement)

    if (result !== undefined) {
      const resultElement = document.createElement('pre')
      resultElement.className = 'result'
      resultElement.textContent = `Result: ${JSON.stringify(result, null, 2)}`
      logEntry.appendChild(resultElement)
    }

    this.logsContainer.insertBefore(logEntry, this.logsContainer.firstChild)
    console.log('Function call:', functionName, args) // Keep console.log for debugging
  }

  private setupDataChannel() {
    this.dataChannel.addEventListener('message', async (event) => {
      const message = JSON.parse(event.data)
      if (message.type === 'response.function_call_arguments.done') {
        try {
          this.addLogEntry(message.name, message.arguments)

          const result = await this.currentPage.runTool(message.name, JSON.parse(message.arguments))

          // Update log entry with result
          const lastEntry = this.logsContainer.firstChild as HTMLElement
          if (lastEntry) {
            const resultElement = document.createElement('pre')
            resultElement.className = 'result'
            resultElement.textContent = `Result: ${JSON.stringify(result, null, 2)}`
            lastEntry.appendChild(resultElement)
          }

          console.log('Result:', result) // Keep console.log for debugging

          this.sendToDataChannel({
            type: 'conversation.item.create',
            item: {
              type: 'function_call_output',
              call_id: message.call_id,
              output: JSON.stringify(result),
            },
          })
          this.sendToDataChannel({ type: 'response.create' })
        } catch (error) {
          console.error('Error running tool:', error)
          // Add error to log entry
          const lastEntry = this.logsContainer.firstChild as HTMLElement
          if (lastEntry) {
            const errorElement = document.createElement('pre')
            errorElement.className = 'result error'
            errorElement.textContent = `Error: ${error}`
            lastEntry.appendChild(errorElement)
          }
        }
      }
    })
  }

  private setupRecordButton() {
    this.recordButton.addEventListener('click', () => this.toggleRecording())
  }

  private sendToDataChannel(data: unknown) {
    if (this.dataChannel.readyState === 'open') {
      this.dataChannel.send(JSON.stringify(data))
    } else {
      console.warn('Data channel not ready, message not sent:', data)
      this.addLogEntry('Warning', 'Data channel not ready, message not sent')
    }
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream
        .getTracks()
        .forEach((track) => this.peerConnection.addTransceiver(track, { direction: 'sendrecv' }))

      const offer = await this.peerConnection.createOffer()
      await this.peerConnection.setLocalDescription(offer)

      const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-realtime-preview-2024-12-17',
          instructions: this.currentPage.getInstructions(),
          voice: 'alloy',
        }),
      })

      const { client_secret } = await response.json()

      const answer = await fetch(
        `https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${client_secret.value}`,
            'Content-Type': 'application/sdp',
          },
          body: offer.sdp,
        }
      ).then((r) => r.text())

      await this.peerConnection.setRemoteDescription({
        type: 'answer',
        sdp: answer,
      })

      this.dataChannel.addEventListener('open', () => {
        this.sendToDataChannel({
          type: 'session.update',
          session: {
            modalities: ['text', 'audio'],
            tools: this.currentPage.getTools(),
          },
        })
      })
    } catch (error) {
      console.error('Error starting recording:', error)
      this.addLogEntry('Error', 'Failed to start recording')
      alert('Failed to start recording. Please check console for details.')
    }
  }

  private async stopRecording() {
    this.dataChannel.close()
    this.peerConnection.close()
    this.peerConnection = new RTCPeerConnection()
    this.dataChannel = this.peerConnection.createDataChannel('oai-events')
  }
}

new VoiceChat()
