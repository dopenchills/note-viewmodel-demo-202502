import { injectable } from 'inversify'
import { BehaviorSubject } from 'rxjs'
import type { IEventAggregator, IPubSubEvent, ISubscription } from 'shared__event-aggregator'
import type { IViewModel } from '../interface/IViewModel'

@injectable()
export abstract class ViewModelBase implements IViewModel {
  private _isBusy: BehaviorSubject<boolean> = new BehaviorSubject(false)
  public isBusy$ = this._isBusy.asObservable()

  private _subscriptions: ISubscription[] = []

  constructor(protected readonly ea: IEventAggregator) {}

  setIsBusy(value: boolean): void {
    this._isBusy.next(value)
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
