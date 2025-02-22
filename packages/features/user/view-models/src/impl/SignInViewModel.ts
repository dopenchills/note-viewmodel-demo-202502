import { inject, injectable } from 'inversify'
import { BehaviorSubject } from 'rxjs'
import { ApiType, IAuthApi } from 'shared__api'
import { ViewModelBase } from 'shared__view-models'
import { EventAggregatorTypes, IEventAggregator } from '../../../../../shared/event-aggregator/src'
import { SignedInEvent } from '../events/SignedInEvent'
import { ISignInViewModel } from '../interfaces/ISignInViewModel'

@injectable()
export class SignInViewModel extends ViewModelBase implements ISignInViewModel {
  private _name: BehaviorSubject<string> = new BehaviorSubject('')
  public name$ = this._name.asObservable()

  private _email: BehaviorSubject<string> = new BehaviorSubject('')
  public email$ = this._email.asObservable()

  private _password: BehaviorSubject<string> = new BehaviorSubject('')
  public password$ = this._password.asObservable()

  private _errorMessages: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])
  public errorMessages$ = this._errorMessages.asObservable()

  constructor(
    @inject(EventAggregatorTypes.EventAggregator) ea: IEventAggregator,
    @inject(ApiType.AuthApi) private authApi: IAuthApi
  ) {
    super(ea)
  }

  setName(name: string): void {
    this._name.next(name)
    this._errorMessages.next([]) // Clear errors on input change
  }

  setEmail(email: string): void {
    this._email.next(email)
    this._errorMessages.next([]) // Clear errors on input change
  }

  setPassword(password: string): void {
    this._password.next(password)
    this._errorMessages.next([]) // Clear errors on input change
  }

  async signIn(): Promise<void> {
    const signInResult = await this.authApi.signIn(this._name.value, this._password.value)

    if (signInResult.isNotOk) {
      const errorMessage = signInResult.error.message
      this._errorMessages.next([errorMessage])
      return
    } else {
      this._errorMessages.next([])

      this.ea.publish(
        new SignedInEvent({
          name: this._name.value,
          email: this._email.value,
          password: this._password.value,
        })
      )
      return
    }
  }
}
