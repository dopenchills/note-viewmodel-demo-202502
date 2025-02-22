import { injectable } from "inversify";
import { IEventAggregator } from "./interfaces/IEventAggregator";
import { IPubSubEvent } from "./interfaces/IPubSubEvent";
import { ISubscription } from "./interfaces/ISubscription";

@injectable()
export class EventAggregator implements IEventAggregator {
  private subscriptions: Map<IPubSubEvent<any>, Set<(e: IPubSubEvent<any>) => Promise<void>>> = new Map();

  subscribe<Payload>(
    event: IPubSubEvent<Payload>,
    callback: (e: IPubSubEvent<Payload>) => Promise<void>
  ): ISubscription {
    if (!this.subscriptions.has(event)) {
      this.subscriptions.set(event, new Set());
    }

    const callbacks = this.subscriptions.get(event)!;
    callbacks.add(callback as (e: IPubSubEvent<any>) => Promise<void>);

    return {
      unsubscribe: () => {
        this.unsubscribe(event, callback);
      },
    };
  }

  publish<Payload>(event: IPubSubEvent<Payload>): void {
    const callbacks = this.subscriptions.get(event);
    if (!callbacks) return;
    
    // Execute all callbacks asynchronously
    callbacks.forEach((callback) => {
      callback(event).catch((error) => {
        console.error('Error in event callback:', error);
      });
    });
  }

  unsubscribe<Payload>(
    event: IPubSubEvent<Payload>,
    callback: (e: IPubSubEvent<Payload>) => Promise<void>
  ): void {
    const callbacks = this.subscriptions.get(event);
    if (!callbacks) return;

    callbacks.delete(callback as (e: IPubSubEvent<any>) => Promise<void>);

    // Clean up the event if there are no more subscribers
    if (callbacks.size === 0) {
      this.subscriptions.delete(event);
    }
  }
}
