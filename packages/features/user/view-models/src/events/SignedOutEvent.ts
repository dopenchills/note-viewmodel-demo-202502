import type { IPubSubEvent } from 'shared__event-aggregator'

export class SignedOutEvent implements IPubSubEvent<void> {
  readonly payload: void

  constructor() {
    this.payload = undefined
  }
}
