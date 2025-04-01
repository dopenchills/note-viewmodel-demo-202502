import { inject, injectable } from 'inversify'
import { BehaviorSubject } from 'rxjs'
import { SignedInEvent } from 'src/features/user/view-models/events/SignedInEvent'
import { SignedOutEvent } from 'src/features/user/view-models/events/SignedOutEvent'
import type { ISignInViewModel } from 'src/features/user/view-models/interfaces/ISignInViewModel'
import { ApiType } from 'src/shared/api/di/ApiType'
import type { IAuthApi } from 'src/shared/api/interface/IAuthApi'
import { EventAggregatorTypes } from 'src/shared/event-aggregator/di/EventAggregatorTypes'
import type { IEventAggregator } from 'src/shared/event-aggregator/interfaces/IEventAggregator'
import { ViewModelBase } from 'src/shared/view-models/base/ViewModelBase'

@injectable()
export class SignInViewModel extends ViewModelBase implements ISignInViewModel {
  private _name: BehaviorSubject<string> = new BehaviorSubject('')
  public name$ = this._name.asObservable()

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

  private reset(): void {
    this._name.next('')
    this._password.next('')
    this._errorMessages.next([])
  }

  setName(name: string): void {
    this._name.next(name)
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
          password: this._password.value,
        })
      )
      return
    }
  }

  async load(): Promise<void> {
    this.subscribe<SignedOutEvent>(SignedOutEvent, async () => {
      this.reset()
    })
  }
}
