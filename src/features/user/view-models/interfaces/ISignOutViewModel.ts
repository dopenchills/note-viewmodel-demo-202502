import type { IViewModel } from 'src/shared/view-models'

export interface ISignOutViewModel extends IViewModel {
  signOut(): Promise<void>
}
