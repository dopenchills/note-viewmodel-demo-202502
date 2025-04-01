import type { IViewModel } from 'src/shared/view-models/interface/IViewModel'
import type { ObservableProps } from 'src/shared/view-models/interface/ObservableProps'

export interface ISignInViewModelProps {
  name: string
  password: string
  errorMessages: string[]
}

export interface ISignInViewModel extends IViewModel, ObservableProps<ISignInViewModelProps> {
  setName(name: string): void
  setPassword(password: string): void
  signIn(): Promise<void>
}
