import { inject, injectable } from 'inversify'
import { SignedOutEvent } from 'src/features/user/view-models/events/SignedOutEvent'
import type { ISignOutViewModel } from 'src/features/user/view-models/interfaces/ISignOutViewModel'
import { EventAggregatorTypes } from 'src/shared/event-aggregator/di/EventAggregatorTypes'
import type { IEventAggregator } from 'src/shared/event-aggregator/interfaces/IEventAggregator'
import { ViewModelBase } from 'src/shared/view-models/base/ViewModelBase'

@injectable()
export class SignOutViewModel extends ViewModelBase implements ISignOutViewModel {
  constructor(@inject(EventAggregatorTypes.EventAggregator) ea: IEventAggregator) {
    super(ea)
  }

  async signOut(): Promise<void> {
    this.ea.publish(new SignedOutEvent())
  }
}
