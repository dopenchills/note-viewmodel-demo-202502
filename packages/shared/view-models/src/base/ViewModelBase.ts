import { injectable } from 'inversify'
import { IEventAggregator, IPubSubEvent, ISubscription } from '../../../event-aggregator/src'
import { IViewModel } from '../interface/IViewModel'

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

  subscribe<T extends IPubSubEvent<any>>(
    eventClass: new (...args: any[]) => T,
    callback: (e: T) => Promise<void>
  ): void {
    this._subscriptions.push(
      this.ea.subscribe(
        eventClass as new <P>(payload: P) => IPubSubEvent<P>,
        callback as (e: IPubSubEvent<any>) => Promise<void>
      )
    )
  }

  unsubscribe(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe())
  }
}
