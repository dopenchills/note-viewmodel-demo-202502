import type { IViewModel } from 'src/shared/view-models/interface/IViewModel'
import type { ObservableProps } from 'src/shared/view-models/interface/ObservableProps'

export interface ISignUpViewModelProps {
  name: string
  password: string
}

export interface ISignUpViewModel extends IViewModel, ObservableProps<ISignUpViewModelProps> {
  setName(name: string): void
  setPassword(password: string): void
  signUp(): Promise<void>
}
