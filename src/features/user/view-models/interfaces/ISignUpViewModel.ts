import type { IViewModel, ObservableProps } from 'src/shared/view-models'

export interface ISignUpViewModelProps {
  name: string
  password: string
}

export interface ISignUpViewModel extends IViewModel, ObservableProps<ISignUpViewModelProps> {
  setName(name: string): void
  setPassword(password: string): void
  signUp(): Promise<void>
}
