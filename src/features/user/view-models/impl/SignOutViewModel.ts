import { inject, injectable } from 'inversify'
import type { IEventAggregator } from 'src/shared/event-aggregator'
import { EventAggregatorTypes } from 'src/shared/event-aggregator'
import { ViewModelBase } from 'src/shared/view-models'
import { SignedOutEvent } from 'src/features/user/view-models/events/SignedOutEvent'
import type { ISignOutViewModel } from 'src/features/user/view-models/interfaces/ISignOutViewModel'

@injectable()
export class SignOutViewModel extends ViewModelBase implements ISignOutViewModel {
  constructor(@inject(EventAggregatorTypes.EventAggregator) ea: IEventAggregator) {
    super(ea)
  }

  async signOut(): Promise<void> {
    this.ea.publish(new SignedOutEvent())
  }
}
