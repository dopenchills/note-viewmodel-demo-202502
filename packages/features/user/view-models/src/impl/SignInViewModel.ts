import { BehaviorSubject } from 'rxjs'
import { ISignInViewModel } from '../interfaces/ISignInViewModel'
import { ViewModelBase } from 'shared__view-models'
import { injectable, inject } from 'inversify'
import { EventAggregatorTypes, IEventAggregator } from '../../../../../shared/event-aggregator/src'
import { SignedInEvent } from '../events/SignedInEvent'

@injectable()
export class SignInViewModel extends ViewModelBase implements ISignInViewModel {
  private _name: BehaviorSubject<string> = new BehaviorSubject('')
  public name$ = this._name.asObservable()

  private _email: BehaviorSubject<string> = new BehaviorSubject('')
  public email$ = this._email.asObservable()

  private _password: BehaviorSubject<string> = new BehaviorSubject('')
  public password$ = this._password.asObservable()

  constructor(@inject(EventAggregatorTypes.EventAggregator) ea: IEventAggregator) {
    super(ea)
  }

  setName(name: string): void {
    this._name.next(name)
  }

  setEmail(email: string): void {
    this._email.next(email)
  }

  setPassword(password: string): void {
    this._password.next(password)
  }

  signIn(): void {
    this.ea.publish(
      new SignedInEvent({
        name: this._name.value,
        email: this._email.value,
        password: this._password.value,
      })
    )
  }
}
