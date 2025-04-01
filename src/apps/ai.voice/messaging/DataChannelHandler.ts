interface Message {
  type: string
  name?: string
  arguments?: string
  call_id?: string
  item?: {
    type: string
    call_id: string
    output: string
  }
  session?: {
    modalities: string[]
    tools: unknown
  }
}

type MessageHandler = (message: Message) => Promise<void>

export class DataChannelHandler {
  constructor(private dataChannel: RTCDataChannel) {}

  setupMessageHandler(handler: MessageHandler) {
    this.dataChannel.addEventListener('message', async (event) => {
      const message = JSON.parse(event.data) as Message
      await handler(message)
    })
  }

  sendMessage(data: Message) {
    if (this.dataChannel.readyState === 'open') {
      this.dataChannel.send(JSON.stringify(data))
    } else {
      console.warn('Data channel not ready, message not sent:', data)
      return false
    }
    return true
  }

  onOpen(callback: () => void) {
    this.dataChannel.addEventListener('open', callback)
  }

  createFunctionCallResponse(callId: string, output: unknown) {
    return [
      {
        type: 'conversation.item.create',
        item: {
          type: 'function_call_output',
          call_id: callId,
          output: JSON.stringify(output),
        },
      },
      { type: 'response.create' },
    ] as Message[]
  }

  updateSession(tools: unknown) {
    return {
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        tools,
      },
    } as Message
  }
}
