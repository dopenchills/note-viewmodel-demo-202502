import type { Note } from 'shared__api'
import type { IViewModel, ObservableProps } from 'shared__view-models'

export interface IListNoteViewModelProps {
  notes: Note[]
  searchQuery: string
}

export interface IListNoteViewModel extends IViewModel, ObservableProps<IListNoteViewModelProps> {
  setSearchQuery(query: string): void
  search(): Promise<void>
}
