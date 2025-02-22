import { IPubSubEvent } from '../../../event-aggregator/src'

export interface IViewModel {
  readonly isBusy: boolean

  setIsBusy(isBusy: boolean): void

  load(): Promise<void>
  unload(): Promise<void>

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribe<T extends IPubSubEvent<any>>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    eventClass: new (...args: any[]) => T,
    callback: (e: T) => Promise<void>
  ): void

  unsubscribe(): void
}
