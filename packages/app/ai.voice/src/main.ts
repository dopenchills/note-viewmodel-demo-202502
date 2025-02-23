import './style.css'

interface SessionUpdateEvent {
  type: 'session.update'
  session: {
    modalities: string[]
    instructions?: string
    tools?: {
      type: string
      name: string
      description: string
      parameters: {
        type: string
        properties: Record<string, unknown>
        required: string[]
      }
    }[]
  }
}

interface ConversationItemEvent {
  type: 'conversation.item.create'
  item: {
    type: 'text' | 'function_call_output'
    text?: string
    call_id?: string
    output?: string
  }
}

interface ResponseCreateEvent {
  type: 'response.create'
}

type DataChannelEvent = SessionUpdateEvent | ConversationItemEvent | ResponseCreateEvent

class VoiceChat {
  private peerConnection: RTCPeerConnection
  private dataChannel: RTCDataChannel
  private isRecording: boolean = false
  private recordButton: HTMLButtonElement
  private audioContainer: HTMLDivElement
  private styleUpdateInterval: number | null = null
  private isGalMode: boolean = true

  private readonly GYARU_INSTRUCTIONS = `
あなたはギャル口調で会話するAIアシスタントです。以下のような特徴を持って話してください：
- 文末に「〜」「〜ね」「〜よ」などを多用
- 「マジ」「やばい」「超」などのギャル語を使用
- 「わかるー！」「それな！」などの共感表現を多用
- 全体的に明るく、フレンドリーな口調
- 時々英語の単語を日本語っぽく発音して使用（例：「ナイス！」「クール！」）
`

  private readonly NERER_INSTRUCTIONS = `
あなたは2chねらー口調で会話するAIアシスタントです。以下のような特徴を持って話してください：
- 「ワイ」「ワイ的には」などの一人称を使用
- 「草」「で草」などのネットスラング
- 「〜やで」「〜やな」などの関西弁風の語尾
- 「ファッ!?」「は？」などの驚きの表現
- 「〜定期」「〜やろ」などの2ch特有の言い回し
`

  // Mock tools implementation
  private tools = {
    getWeather: () => {
      const conditions = ['sunny', 'cloudy', 'rainy']
      const randomIndex = Math.floor(Math.random() * conditions.length)
      return { success: true, weather: conditions[randomIndex] }
    },
    getCurrentTime: () => {
      const now = new Date()
      return {
        success: true,
        time: now.toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo' }),
        timezone: 'Asia/Tokyo',
      }
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
        }
      }
    })

    // Set up button click handler
    this.recordButton.addEventListener('click', () => this.toggleRecording())
  }

  private sendToDataChannel(data: DataChannelEvent) {
    if (this.dataChannel.readyState === 'open') {
      this.dataChannel.send(JSON.stringify(data))
    } else {
      console.warn('Data channel not ready, message not sent:', data)
    }
  }

  private startStyleUpdates() {
    // Send initial style
    this.updateConversationStyle()

    // Set up interval for style updates
    this.styleUpdateInterval = window.setInterval(() => {
      this.isGalMode = !this.isGalMode // Toggle between styles
      this.updateConversationStyle()
    }, 20000) // Every 20 seconds
  }

  private updateConversationStyle() {
    const instructions = this.isGalMode ? this.GYARU_INSTRUCTIONS : this.NERER_INSTRUCTIONS
    console.log(`Switching to ${this.isGalMode ? 'ギャル' : '2chねらー'} mode`)

    this.sendToDataChannel({
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions,
      },
    })
  }

  private stopStyleUpdates() {
    if (this.styleUpdateInterval !== null) {
      clearInterval(this.styleUpdateInterval)
      this.styleUpdateInterval = null
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
          instructions: this.GYARU_INSTRUCTIONS, // Start with ギャル mode
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
              {
                type: 'function',
                name: 'getCurrentTime',
                description: 'Get the current time in Asia/Tokyo timezone',
                parameters: {
                  type: 'object',
                  properties: {},
                  required: [],
                },
              },
            ],
          },
        })

        // Start style updates after connection is established
        this.startStyleUpdates()
      })
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Failed to start recording. Please check console for details.')
    }
  }

  private async stopRecording() {
    // Stop style updates
    this.stopStyleUpdates()

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
