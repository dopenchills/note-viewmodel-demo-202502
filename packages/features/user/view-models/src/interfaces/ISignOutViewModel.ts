import type { IViewModel } from 'shared__view-models'

export interface ISignOutViewModel extends IViewModel {
  signOut(): Promise<void>
}
