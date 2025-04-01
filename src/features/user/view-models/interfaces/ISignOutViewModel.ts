import type { IViewModel } from 'src/shared/view-models/interface/IViewModel'

export interface ISignOutViewModel extends IViewModel {
  signOut(): Promise<void>
}
