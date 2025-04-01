import { inject, injectable } from 'inversify'
import { BehaviorSubject } from 'rxjs'
import type { IAuthApi } from 'src/shared/api'
import { ApiType } from 'src/shared/api'
import type { IEventAggregator } from 'src/shared/event-aggregator'
import { EventAggregatorTypes } from 'src/shared/event-aggregator'
import { ViewModelBase } from 'src/shared/view-models'
import { SignedOutEvent } from 'src/features/user/view-models/events/SignedOutEvent'
import { SignedUpEvent } from 'src/features/user/view-models/events/SignedUpEvent'
import type { ISignUpViewModel } from 'src/features/user/view-models/interfaces/ISignUpViewModel'

@injectable()
export class SignUpViewModel extends ViewModelBase implements ISignUpViewModel {
  private _name: BehaviorSubject<string> = new BehaviorSubject('')
  public name$ = this._name.asObservable()

  private _password: BehaviorSubject<string> = new BehaviorSubject('')
  public password$ = this._password.asObservable()

  constructor(
    @inject(EventAggregatorTypes.EventAggregator) ea: IEventAggregator,
    @inject(ApiType.AuthApi) private readonly authApi: IAuthApi
  ) {
    super(ea)
  }

  private reset(): void {
    this._name.next('')
    this._password.next('')
  }

  setName(name: string): void {
    this._name.next(name)
  }

  setPassword(password: string): void {
    this._password.next(password)
  }

  async signUp(): Promise<void> {
    const signUpResult = await this.authApi.signUp(this._name.value, this._password.value)

    if (signUpResult.isNotOk) {
      return
    } else {
      this.ea.publish(
        new SignedUpEvent({
          name: this._name.value,
          password: this._password.value,
        })
      )
    }
  }

  async load(): Promise<void> {
    this.subscribe<SignedOutEvent>(SignedOutEvent, async () => {
      this.reset()
    })
  }
}
