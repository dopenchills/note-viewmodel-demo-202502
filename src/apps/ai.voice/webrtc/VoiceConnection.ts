export class VoiceConnection {
  private peerConnection: RTCPeerConnection
  private dataChannel: RTCDataChannel

  constructor() {
    this.peerConnection = new RTCPeerConnection()
    this.dataChannel = this.peerConnection.createDataChannel('oai-events')
  }

  setupAudioHandling(audioContainer: HTMLDivElement) {
    this.peerConnection.ontrack = (event) => {
      const audioElement = document.createElement('audio')
      audioElement.srcObject = event.streams[0]
      audioElement.autoplay = true
      audioElement.controls = true
      audioContainer.innerHTML = ''
      audioContainer.appendChild(audioElement)
    }
  }

  async startStream() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream
      .getTracks()
      .forEach((track) => this.peerConnection.addTransceiver(track, { direction: 'sendrecv' }))

    const offer = await this.peerConnection.createOffer()
    await this.peerConnection.setLocalDescription(offer)
    return offer
  }

  async setRemoteDescription(answer: string) {
    await this.peerConnection.setRemoteDescription({
      type: 'answer',
      sdp: answer,
    })
  }

  getDataChannel() {
    return this.dataChannel
  }

  close() {
    this.dataChannel.close()
    this.peerConnection.close()
  }

  createNew() {
    this.peerConnection = new RTCPeerConnection()
    this.dataChannel = this.peerConnection.createDataChannel('oai-events')
    return this
  }
}
