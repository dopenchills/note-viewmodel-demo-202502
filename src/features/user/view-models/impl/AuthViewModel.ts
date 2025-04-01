import { inject, injectable } from 'inversify'
import { BehaviorSubject } from 'rxjs'
import { SignedInEvent } from 'src/features/user/view-models/events/SignedInEvent'
import { SignedOutEvent } from 'src/features/user/view-models/events/SignedOutEvent'
import type { IAuthViewModel } from 'src/features/user/view-models/interfaces/IAuthViewModel'
import { EventAggregatorTypes } from 'src/shared/event-aggregator/di/EventAggregatorTypes'
import type { IEventAggregator } from 'src/shared/event-aggregator/interfaces/IEventAggregator'
import { ViewModelBase } from 'src/shared/view-models/base/ViewModelBase'

@injectable()
export class AuthViewModel extends ViewModelBase implements IAuthViewModel {
  private _isSignedIn: BehaviorSubject<boolean> = new BehaviorSubject(false)
  public isSignedIn$ = this._isSignedIn.asObservable()

  private _userName: BehaviorSubject<string> = new BehaviorSubject('')
  public userName$ = this._userName.asObservable()

  constructor(@inject(EventAggregatorTypes.EventAggregator) ea: IEventAggregator) {
    super(ea)
  }

  async load(): Promise<void> {
    this.subscribe<SignedInEvent>(SignedInEvent, async (event) => {
      this._isSignedIn.next(true)
      this._userName.next(event.payload.name)
    })

    this.subscribe<SignedOutEvent>(SignedOutEvent, async () => {
      this._isSignedIn.next(false)
      this._userName.next('')
    })
  }
}
