import type { IPubSubEvent } from 'src/shared/event-aggregator'

export interface SignedUpPayload {
  name: string
  password: string
}

export class SignedUpEvent implements IPubSubEvent<SignedUpPayload> {
  constructor(public payload: SignedUpPayload) {}
}
