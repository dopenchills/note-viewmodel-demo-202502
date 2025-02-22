import { IPubSubEvent } from "./IPubSubEvent";
import { ISubscription } from "./ISubscription";

export interface IEventAggregator {
  subscribe<Payload>(
    eventClass: new <Payload>(payload: Payload) => IPubSubEvent<Payload>,
    callback: (e: IPubSubEvent<Payload>) => Promise<void>
  ): ISubscription;
  
  unsubscribe<Payload>(
    eventClass: new <Payload>(payload: Payload) => IPubSubEvent<Payload>,
    callback: (e: IPubSubEvent<Payload>) => Promise<void>
  ): void;

  publish<Payload>(event: IPubSubEvent<Payload>): void;
}
