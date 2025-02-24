import { ContainerModule } from 'inversify'
import { CreateNoteViewModel } from '../impl/CreateNoteViewModel'
import { ListNoteViewModel } from '../impl/ListNoteViewModel'
import type { ICreateNoteViewModel } from '../interfaces/ICreateNoteViewModel'
import type { IListNoteViewModel } from '../interfaces/IListNoteViewModel'
import { NoteTypes } from './NoteTypes'

export const noteModule = new ContainerModule((bind) => {
  bind<IListNoteViewModel>(NoteTypes.ListNoteViewModel).to(ListNoteViewModel)

  bind<ICreateNoteViewModel>(NoteTypes.CreateNoteViewModel).to(CreateNoteViewModel)
})
