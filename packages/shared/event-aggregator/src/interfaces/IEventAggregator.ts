import { IPubSubEvent } from "./IPubSubEvent";
import { ISubscription } from "./ISubscription";

export interface IEventAggregator {
  subscribe<Payload>(event: IPubSubEvent<Payload>, callback: (e: IPubSubEvent<Payload>) => Promise<void>): ISubscription;
  publish<Payload>(event: IPubSubEvent<Payload>): void;
  unsubscribe<Payload>(event: IPubSubEvent<Payload>, callback: (e: IPubSubEvent<Payload>) => Promise<void>): void;
}
