import { inject, injectable } from 'inversify'
import { BehaviorSubject } from 'rxjs'
import type { IAuthApi } from 'shared__api'
import { ApiType } from 'shared__api'
import type { IEventAggregator } from 'shared__event-aggregator'
import { EventAggregatorTypes } from 'shared__event-aggregator'
import { ViewModelBase } from 'shared__view-models'
import { SignedUpEvent } from '../events/SignedUpEvent'
import type { ISignUpViewModel } from '../interfaces/ISignUpViewModel'

@injectable()
export class SignUpViewModel extends ViewModelBase implements ISignUpViewModel {
  private _name: BehaviorSubject<string> = new BehaviorSubject('')
  public name$ = this._name.asObservable()

  private _email: BehaviorSubject<string> = new BehaviorSubject('')
  public email$ = this._email.asObservable()

  private _password: BehaviorSubject<string> = new BehaviorSubject('')
  public password$ = this._password.asObservable()

  constructor(
    @inject(EventAggregatorTypes.EventAggregator) ea: IEventAggregator,
    @inject(ApiType.AuthApi) private readonly authApi: IAuthApi
  ) {
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

  async signUp(): Promise<void> {
    const signUpResult = await this.authApi.signUp(
      this._name.value,
      this._email.value,
      this._password.value
    )

    if (signUpResult.isNotOk) {
      return
    } else {
      this.ea.publish(
        new SignedUpEvent({
          name: this._name.value,
          email: this._email.value,
          password: this._password.value,
        })
      )
    }
  }
}
