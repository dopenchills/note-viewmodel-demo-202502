import { inject, injectable } from 'inversify'
import type { IEventAggregator } from 'shared__event-aggregator'
import { EventAggregatorTypes } from 'shared__event-aggregator'
import { ViewModelBase } from 'shared__view-models'
import { SignedOutEvent } from '../events/SignedOutEvent'
import type { ISignOutViewModel } from '../interfaces/ISignOutViewModel'

@injectable()
export class SignOutViewModel extends ViewModelBase implements ISignOutViewModel {
  constructor(@inject(EventAggregatorTypes.EventAggregator) ea: IEventAggregator) {
    super(ea)
  }

  async signOut(): Promise<void> {
    this.ea.publish(new SignedOutEvent())
  }
}
