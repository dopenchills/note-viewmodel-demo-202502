import { ContainerModule } from 'inversify'
import { MockedAuthApi } from 'src/shared/api/impl/MockedAuthApi'
import { MockedNoteApi } from 'src/shared/api/impl/MockedNoteApi'
import { ApiType } from 'src/shared/api/di/ApiType'

export const apiModule = new ContainerModule((bind) => {
  bind(ApiType.AuthApi).to(MockedAuthApi).inSingletonScope()
  bind(ApiType.NoteApi).to(MockedNoteApi).inSingletonScope()
})
