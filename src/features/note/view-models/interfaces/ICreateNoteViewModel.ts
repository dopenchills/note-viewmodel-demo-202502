import type { IViewModel } from 'src/shared/view-models/interface/IViewModel'
import type { ObservableProps } from 'src/shared/view-models/interface/ObservableProps'

export interface ICreateNoteViewModelProps {
  title: string
  content: string
  errorMessages: string[]
}

export interface ICreateNoteViewModel
  extends IViewModel,
    ObservableProps<ICreateNoteViewModelProps> {
  setTitle(title: string): void
  setContent(content: string): void
  createNote(): Promise<void>
}
