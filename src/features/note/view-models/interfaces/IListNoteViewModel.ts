import type { Note } from 'src/shared/api/interface/INoteApi'
import type { IViewModel } from 'src/shared/view-models/interface/IViewModel'
import type { ObservableProps } from 'src/shared/view-models/interface/ObservableProps'

export interface IListNoteViewModelProps {
  notes: Note[]
  searchQuery: string
}

export interface IListNoteViewModel extends IViewModel, ObservableProps<IListNoteViewModelProps> {
  setSearchQuery(query: string): void
  search(): Promise<void>
}
