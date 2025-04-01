import type { IPubSubEvent } from 'src/shared/event-aggregator/interfaces/IPubSubEvent'

export interface SignedInPayload {
  name: string
  password: string
}

export class SignedInEvent implements IPubSubEvent<SignedInPayload> {
  constructor(public payload: SignedInPayload) {}
}
