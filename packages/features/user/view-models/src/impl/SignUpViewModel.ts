import { BehaviorSubject } from 'rxjs'
import { ISignUpViewModel } from '../interfaces/ISignUpViewModel'
import { ViewModelBase } from 'shared__view-models'
import { injectable, inject } from 'inversify'
import { EventAggregatorTypes, IEventAggregator } from '../../../../../shared/event-aggregator/src'
import { SignedUpEvent } from '../events/SignedUpEvent'

@injectable()
export class SignUpViewModel extends ViewModelBase implements ISignUpViewModel {
  private _name: BehaviorSubject<string> = new BehaviorSubject('')
  public name$ = this._name.asObservable()

  private _email: BehaviorSubject<string> = new BehaviorSubject('')
  public email$ = this._email.asObservable()

  private _password: BehaviorSubject<string> = new BehaviorSubject('')
  public password$ = this._password.asObservable()

  private _confirmPassword: BehaviorSubject<string> = new BehaviorSubject('')
  public confirmPassword$ = this._confirmPassword.asObservable()

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

  setConfirmPassword(confirmPassword: string): void {
    this._confirmPassword.next(confirmPassword)
  }

  signUp(): void {
    this.ea.publish(
      new SignedUpEvent({
        name: this._name.value,
        email: this._email.value,
        password: this._password.value,
      })
    )
  }
}
