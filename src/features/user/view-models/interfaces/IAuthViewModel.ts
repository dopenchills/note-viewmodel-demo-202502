import type { IViewModel, ObservableProps } from 'src/shared/view-models'

export interface IAuthViewModelProps {
  isSignedIn: boolean
  userName: string
}

export interface IAuthViewModel extends IViewModel, ObservableProps<IAuthViewModelProps> {}
