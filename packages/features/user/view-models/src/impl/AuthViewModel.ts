import { inject, injectable } from 'inversify'
import { BehaviorSubject } from 'rxjs'
import { EventAggregatorTypes, IEventAggregator } from 'shared__event-aggregator'
import { ViewModelBase } from 'shared__view-models'
import { SignedInEvent } from '../events/SignedInEvent'
import { IAuthViewModel } from '../interfaces/IAuthViewModel'

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
  }
}
