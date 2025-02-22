import { BehaviorSubject } from 'rxjs'
import { IAuthViewModel } from '../interfaces/IAuthViewModel'
import { ViewModelBase } from 'shared__view-models'
import { injectable, inject } from 'inversify'
import { EventAggregatorTypes, IEventAggregator } from '../../../../../shared/event-aggregator/src'
import { SignedInEvent, SignedInPayload } from '../events/SignedInEvent'

@injectable()
export class AuthViewModel extends ViewModelBase implements IAuthViewModel {
  private _isSignedIn: BehaviorSubject<boolean> = new BehaviorSubject(false)
  public isSignedIn$ = this._isSignedIn.asObservable()

  constructor(@inject(EventAggregatorTypes.EventAggregator) ea: IEventAggregator) {
    super(ea)
    this.subscribeToSignInEvents()
  }

  private subscribeToSignInEvents(): void {
    this.subscribe<SignedInEvent>(SignedInEvent, async (e) => {
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
