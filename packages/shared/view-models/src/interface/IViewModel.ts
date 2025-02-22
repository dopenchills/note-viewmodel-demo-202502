import { IEventAggregator, IPubSubEvent } from '../../../event-aggregator/src'

export interface IViewModel {
  readonly isBusy: boolean

  setIsBusy(isBusy: boolean): void

  load(): Promise<void>
  unload(): Promise<void>

  subscribe<T extends IPubSubEvent<any>>(
    eventClass: new (...args: any[]) => T,
    callback: (e: T) => Promise<void>
  ): void

  unsubscribe(): void
}
