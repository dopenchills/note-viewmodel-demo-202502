import { inject, injectable } from 'inversify'
import { BehaviorSubject } from 'rxjs'
import { IResult, NotOk, Ok } from 'shared__result'
import { ViewModelBase } from 'shared__view-models'
import { EventAggregatorTypes, IEventAggregator } from '../../../../../shared/event-aggregator/src'
import { SignedInEvent } from '../events/SignedInEvent'
import { SignedUpEvent } from '../events/SignedUpEvent'
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

  private authStore: Set<{
    name: string
    email: string
    password: string
  }> = new Set([
    {
      name: 'John',
      email: 'john@example.com',
      password: 'password',
    },
  ])

  constructor(@inject(EventAggregatorTypes.EventAggregator) ea: IEventAggregator) {
    super(ea)

    this.subscribe<SignedUpEvent>(SignedUpEvent, async (event) => {
      this.authStore.add(event.payload)
    })
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

  signIn(): IResult<void> {
    const user = Array.from(this.authStore).find(
      (user) => user.name === this._name.value && user.password === this._password.value
    )

    if (user === undefined) {
      const error = '認証に失敗しました'
      this._errorMessages.next([error])
      return new NotOk(new Error(error))
    }

    this._errorMessages.next([])
    this.ea.publish(new SignedInEvent(user))
    return new Ok(undefined)
  }
}
