import type { IViewModel, ObservableProps } from 'src/shared/view-models'

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
