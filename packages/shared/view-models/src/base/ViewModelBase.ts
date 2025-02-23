import { injectable } from 'inversify'
import type { IEventAggregator, IPubSubEvent, ISubscription } from 'shared__event-aggregator'
import type { IViewModel } from '../interface/IViewModel'

@injectable()
export abstract class ViewModelBase implements IViewModel {
  private _isBusy: boolean = false
  private _subscriptions: ISubscription[] = []

  get isBusy(): boolean {
    return this._isBusy
  }

  constructor(protected readonly ea: IEventAggregator) {}

  setIsBusy(isBusy: boolean): void {
    this._isBusy = isBusy
  }

  load(): Promise<void> {
    return Promise.resolve()
  }

  unload(): Promise<void> {
    this.unsubscribe()
    return Promise.resolve()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribe<T extends IPubSubEvent<any>>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    eventClass: new (...args: any[]) => T,
    callback: (e: T) => Promise<void>
  ): void {
    this._subscriptions.push(
      this.ea.subscribe(
        eventClass as new <P>(payload: P) => IPubSubEvent<P>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback as (e: IPubSubEvent<any>) => Promise<void>
      )
    )
  }

  unsubscribe(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe())
  }
}
