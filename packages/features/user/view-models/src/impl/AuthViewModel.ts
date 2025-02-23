import { inject, injectable } from 'inversify'
import { BehaviorSubject } from 'rxjs'
import type { IEventAggregator } from 'shared__event-aggregator'
import { EventAggregatorTypes } from 'shared__event-aggregator'
import { ViewModelBase } from 'shared__view-models'
import { SignedInEvent } from '../events/SignedInEvent'
import { SignedOutEvent } from '../events/SignedOutEvent'
import type { IAuthViewModel } from '../interfaces/IAuthViewModel'

@injectable()
export class AuthViewModel extends ViewModelBase implements IAuthViewModel {
  private _isSignedIn: BehaviorSubject<boolean> = new BehaviorSubject(false)
  public isSignedIn$ = this._isSignedIn.asObservable()

  constructor(@inject(EventAggregatorTypes.EventAggregator) ea: IEventAggregator) {
    super(ea)

    this.subscribe<SignedInEvent>(SignedInEvent, async () => {
      this._isSignedIn.next(true)
    })
  }

  signIn(): void {
    this._isSignedIn.next(true)
  }

  signOut(): void {
    this._isSignedIn.next(false)
    this.ea.publish(new SignedOutEvent())
  }
}
