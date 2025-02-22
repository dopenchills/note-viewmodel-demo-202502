import { IEventAggregator, IPubSubEvent } from "../../../event-aggregator/src";

export interface IViewModel {
  readonly isBusy: boolean;

  setIsBusy(isBusy: boolean): void;

  load(): Promise<void>;
  unload(): Promise<void>;

  subscribe<Payload>(ea: IEventAggregator, event: IPubSubEvent<Payload>, callback: (e: IPubSubEvent<Payload>) => Promise<void>): void;
  unsubscribe(): void;
}
