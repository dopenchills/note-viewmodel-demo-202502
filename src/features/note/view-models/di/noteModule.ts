import { ContainerModule } from 'inversify'
import { CreateNoteViewModel } from 'src/features/note/view-models/impl/CreateNoteViewModel'
import { ListNoteViewModel } from 'src/features/note/view-models/impl/ListNoteViewModel'
import type { ICreateNoteViewModel } from '../interfaces/ICreateNoteViewModel'
import type { IListNoteViewModel } from '../interfaces/IListNoteViewModel'
import { NoteTypes } from 'src/features/note/view-models/di/NoteTypes'

export const noteModule = new ContainerModule((bind) => {
  bind<IListNoteViewModel>(NoteTypes.ListNoteViewModel).to(ListNoteViewModel)

  bind<ICreateNoteViewModel>(NoteTypes.CreateNoteViewModel).to(CreateNoteViewModel)
})
