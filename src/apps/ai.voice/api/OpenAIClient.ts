interface SessionResponse {
  client_secret: {
    value: string
  }
}

interface SessionConfig {
  model: string
  instructions: string
  voice: string
}

export class OpenAIClient {
  private readonly apiKey: string
  private readonly model = 'gpt-4o-realtime-preview-2024-12-17'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async createSession(instructions: string): Promise<SessionResponse> {
    const config: SessionConfig = {
      model: this.model,
      instructions,
      voice: 'alloy',
    }

    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    })

    if (!response.ok) {
      throw new Error(`Failed to create session: ${response.statusText}`)
    }

    return response.json()
  }

  async getAnswer(clientSecret: string, offerSdp: string): Promise<string> {
    const response = await fetch(`https://api.openai.com/v1/realtime?model=${this.model}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${clientSecret}`,
        'Content-Type': 'application/sdp',
      },
      body: offerSdp,
    })

    if (!response.ok) {
      throw new Error(`Failed to get answer: ${response.statusText}`)
    }

    return response.text()
  }
}
