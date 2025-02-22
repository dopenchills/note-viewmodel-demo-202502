import { inject, injectable } from 'inversify'
import { BehaviorSubject } from 'rxjs'
import { ViewModelBase } from 'shared__view-models'
import { EventAggregatorTypes, IEventAggregator } from '../../../../../shared/event-aggregator/src'
import { SignedInEvent } from '../events/SignedInEvent'
import { IAuthViewModel } from '../interfaces/IAuthViewModel'

@injectable()
export class AuthViewModel extends ViewModelBase implements IAuthViewModel {
  private _isSignedIn: BehaviorSubject<boolean> = new BehaviorSubject(false)
  public isSignedIn$ = this._isSignedIn.asObservable()

  constructor(@inject(EventAggregatorTypes.EventAggregator) ea: IEventAggregator) {
    super(ea)
    this.subscribeToSignInEvents()
  }

  private subscribeToSignInEvents(): void {
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
