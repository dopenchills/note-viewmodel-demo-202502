import type { IViewModel, ObservableProps } from 'shared__view-models'

export interface IAuthViewModelProps {
  isSignedIn: boolean
  userName: string
}

export interface IAuthViewModel extends IViewModel, ObservableProps<IAuthViewModelProps> {}
