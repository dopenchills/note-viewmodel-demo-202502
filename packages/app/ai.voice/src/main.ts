import { IPage } from 'features__shared__views.ai.voice/interfaces'
import { AuthPage } from 'features__user__views.ai.voice/pages'
import './style.css'

class VoiceChat {
  private peerConnection: RTCPeerConnection
  private dataChannel: RTCDataChannel
  private isRecording: boolean = false
  private recordButton: HTMLButtonElement
  private audioContainer: HTMLDivElement
  private currentPage: IPage

  constructor() {
    // Initialize with AuthPage
    this.currentPage = new AuthPage()

    // Initialize UI elements
    this.recordButton = document.querySelector<HTMLButtonElement>('#recordButton')!
    this.audioContainer = document.querySelector<HTMLDivElement>('#audioContainer')!

    // Initialize WebRTC
    this.peerConnection = new RTCPeerConnection()
    this.dataChannel = this.peerConnection.createDataChannel('oai-events')

    // Handle incoming audio
    this.peerConnection.ontrack = (event) => {
      const audioElement = document.createElement('audio')
      audioElement.srcObject = event.streams[0]
      audioElement.autoplay = true
      audioElement.controls = true

      // Clear previous audio elements
      this.audioContainer.innerHTML = ''
      this.audioContainer.appendChild(audioElement)
    }

    // Handle data channel messages
    this.dataChannel.addEventListener('message', async (event) => {
      const message = JSON.parse(event.data)

      // Handle function calls
      if (message.type === 'response.function_call_arguments.done') {
        try {
          console.log(`Calling function ${message.name}`)
          const result = await this.currentPage.runTool(message.name, JSON.parse(message.arguments))
          console.log('Function result:', result)

          // Send function result back to OpenAI
          this.sendToDataChannel({
            type: 'conversation.item.create',
            item: {
              type: 'function_call_output',
              call_id: message.call_id,
              output: JSON.stringify(result),
            },
          })

          // Request assistant to continue
          this.sendToDataChannel({ type: 'response.create' })
        } catch (error) {
          console.error('Error running tool:', error)
        }
      }
    })

    // Set up button click handler
    this.recordButton.addEventListener('click', () => this.toggleRecording())
  }

  private sendToDataChannel(data: unknown) {
    if (this.dataChannel.readyState === 'open') {
      this.dataChannel.send(JSON.stringify(data))
    } else {
      console.warn('Data channel not ready, message not sent:', data)
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
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Add audio track to peer connection
      stream
        .getTracks()
        .forEach((track) => this.peerConnection.addTransceiver(track, { direction: 'sendrecv' }))

      // Create and set local description
      const offer = await this.peerConnection.createOffer()
      await this.peerConnection.setLocalDescription(offer)

      // Connect to OpenAI Realtime API
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

      // Connect WebRTC with OpenAI
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

      // Set remote description
      await this.peerConnection.setRemoteDescription({
        type: 'answer',
        sdp: answer,
      })

      // Configure data channel for text/audio modalities and tools
      this.dataChannel.addEventListener('open', () => {
        // Send initial session configuration
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
      alert('Failed to start recording. Please check console for details.')
    }
  }

  private async stopRecording() {
    // Close data channel and peer connection
    this.dataChannel.close()
    this.peerConnection.close()

    // Reinitialize for next session
    this.peerConnection = new RTCPeerConnection()
    this.dataChannel = this.peerConnection.createDataChannel('oai-events')
  }
}

// Initialize voice chat when page loads
new VoiceChat()
