import { ContainerModule } from 'inversify'
import { MockedAuthApi } from '../impl/MockedAuthApi'
import { MockedNoteApi } from '../impl/MockedNoteApi'
import { ApiType } from './ApiType'

export const apiModule = new ContainerModule((bind) => {
  bind(ApiType.AuthApi).to(MockedAuthApi).inSingletonScope()
  bind(ApiType.NoteApi).to(MockedNoteApi).inSingletonScope()
})
