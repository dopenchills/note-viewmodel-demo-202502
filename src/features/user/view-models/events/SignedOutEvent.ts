import type { IPubSubEvent } from 'src/shared/event-aggregator'

export class SignedOutEvent implements IPubSubEvent<void> {
  readonly payload: void

  constructor() {
    this.payload = undefined
  }
}
