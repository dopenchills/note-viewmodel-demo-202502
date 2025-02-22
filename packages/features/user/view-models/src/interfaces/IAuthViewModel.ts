import { IViewModel, ObservableProps } from 'shared__view-models'

export interface IAuthViewModelProps {
  isSignedIn: boolean
}

export interface IAuthViewModel extends IViewModel, ObservableProps<IAuthViewModelProps> {
  signIn(): void
  signOut(): void
}
