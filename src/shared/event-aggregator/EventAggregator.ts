import { injectable } from 'inversify'
import type { IEventAggregator } from './interfaces/IEventAggregator'
import type { IPubSubEvent } from './interfaces/IPubSubEvent'
import type { ISubscription } from './interfaces/ISubscription'

@injectable()
export class EventAggregator implements IEventAggregator {
  private subscriptions: Map<
    new <P>(payload: P) => IPubSubEvent<P>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Set<(e: IPubSubEvent<any>) => Promise<void>>
  > = new Map()

  subscribe<Payload>(
    eventClass: new <Payload>(payload: Payload) => IPubSubEvent<Payload>,
    callback: (e: IPubSubEvent<Payload>) => Promise<void>
  ): ISubscription {
    if (!this.subscriptions.has(eventClass)) {
      this.subscriptions.set(eventClass, new Set())
    }

    const callbacks = this.subscriptions.get(eventClass)!
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callbacks.add(callback as (e: IPubSubEvent<any>) => Promise<void>)

    return {
      unsubscribe: () => {
        this.unsubscribe(eventClass, callback)
      },
    }
  }

  publish<Payload>(event: IPubSubEvent<Payload>): void {
    const eventClass = event.constructor as new <P>(payload: P) => IPubSubEvent<P>
    const callbacks = this.subscriptions.get(eventClass)
    if (!callbacks) return

    // Execute all callbacks asynchronously
    callbacks.forEach((callback) => {
      callback(event).catch((error) => {
        console.error('Error in event callback:', error)
      })
    })
  }

  unsubscribe<Payload>(
    eventClass: new <Payload>(payload: Payload) => IPubSubEvent<Payload>,
    callback: (e: IPubSubEvent<Payload>) => Promise<void>
  ): void {
    const callbacks = this.subscriptions.get(eventClass)
    if (!callbacks) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callbacks.delete(callback as (e: IPubSubEvent<any>) => Promise<void>)

    // Clean up the event if there are no more subscribers
    if (callbacks.size === 0) {
      this.subscriptions.delete(eventClass)
    }
  }
}
