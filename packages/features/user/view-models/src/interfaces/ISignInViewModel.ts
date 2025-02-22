import { IViewModel, ObservableProps } from 'shared__view-models'

export interface ISignInViewModelProps {
  name: string
  email: string
  password: string
  errorMessages: string[]
}

export interface ISignInViewModel extends IViewModel, ObservableProps<ISignInViewModelProps> {
  setName(name: string): void
  setEmail(email: string): void
  setPassword(password: string): void
  signIn(): Promise<void>
}
