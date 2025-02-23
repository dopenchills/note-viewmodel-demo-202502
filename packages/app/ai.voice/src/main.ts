import './style.css'

class VoiceChat {
  private peerConnection: RTCPeerConnection
  private dataChannel: RTCDataChannel
  private isRecording: boolean = false
  private recordButton: HTMLButtonElement
  private audioContainer: HTMLDivElement

  // Mock tools implementation
  private tools = {
    getWeather: () => {
      const conditions = ['thunderstorms', 'rain', 'cloudy', 'sunny', 'snow']
      const randomIndex = Math.floor(Math.random() * conditions.length)
      return { success: true, weather: conditions[randomIndex] }
    },
  }

  constructor() {
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
        const fn = this.tools[message.name as keyof typeof this.tools]
        if (fn) {
          console.log(`Calling function ${message.name}`)
          const result = await fn()
          console.log('Function result:', result)

          // Send function result back to OpenAI
          const resultEvent = {
            type: 'conversation.item.create',
            item: {
              type: 'function_call_output',
              call_id: message.call_id,
              output: JSON.stringify(result),
            },
          }
          this.dataChannel.send(JSON.stringify(resultEvent))

          // Request assistant to continue
          this.dataChannel.send(JSON.stringify({ type: 'response.create' }))
        }
      }
    })

    // Set up button click handler
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
          instructions:
            'You are a helpful AI assistant who engages in natural conversation. You can check the weather using the getWeather function.',
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
        const event = {
          type: 'session.update',
          session: {
            modalities: ['text', 'audio'],
            tools: [
              {
                type: 'function',
                name: 'getWeather',
                description: 'Get the current weather conditions',
                parameters: {
                  type: 'object',
                  properties: {},
                  required: [],
                },
              },
            ],
          },
        }
        this.dataChannel.send(JSON.stringify(event))
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
