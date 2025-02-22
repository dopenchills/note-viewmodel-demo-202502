import { injectable } from 'inversify';
import { IEventAggregator, IPubSubEvent, ISubscription } from '../../../event-aggregator/src';
import { IViewModel } from '../interface/IViewModel';

@injectable()
export abstract class ViewModelBase implements IViewModel {
  private _isBusy: boolean = false;
  private _subscriptions: ISubscription[] = [];

  get isBusy(): boolean {
    return this._isBusy;
  }

  constructor(
    private readonly ea: IEventAggregator
  ) {}

  setIsBusy(isBusy: boolean): void {
    this._isBusy = isBusy;
  }

  load(): Promise<void> {
    return Promise.resolve();
  }

  unload(): Promise<void> {
    this.unsubscribe();
    return Promise.resolve();
  }

  subscribe<Payload>(ea: IEventAggregator, event: IPubSubEvent<Payload>, callback: (e: IPubSubEvent<Payload>) => Promise<void>): void {
    this._subscriptions.push(ea.subscribe(event, callback));
  }

  unsubscribe(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
