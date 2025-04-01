import type { IViewModel } from 'src/shared/view-models/interface/IViewModel'
import type { ObservableProps } from 'src/shared/view-models/interface/ObservableProps'

export interface IAuthViewModelProps {
  isSignedIn: boolean
  userName: string
}

export interface IAuthViewModel extends IViewModel, ObservableProps<IAuthViewModelProps> {}
