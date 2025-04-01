import type { Note } from 'src/shared/api'
import type { IViewModel, ObservableProps } from 'src/shared/view-models'

export interface IListNoteViewModelProps {
  notes: Note[]
  searchQuery: string
}

export interface IListNoteViewModel extends IViewModel, ObservableProps<IListNoteViewModelProps> {
  setSearchQuery(query: string): void
  search(): Promise<void>
}
