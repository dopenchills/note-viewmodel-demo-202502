import { inject, injectable } from 'inversify'
import { BehaviorSubject } from 'rxjs'
import type { INoteApi, Note } from 'src/shared/api'
import { ApiType } from 'src/shared/api'
import type { IEventAggregator } from 'src/shared/event-aggregator'
import { EventAggregatorTypes } from 'src/shared/event-aggregator'
import { ViewModelBase } from 'src/shared/view-models'
import type { IListNoteViewModel } from 'src/features/note/view-models/interfaces/IListNoteViewModel'

@injectable()
export class ListNoteViewModel extends ViewModelBase implements IListNoteViewModel {
  private _notes: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([])
  public notes$ = this._notes.asObservable()

  private _searchQuery: BehaviorSubject<string> = new BehaviorSubject('')
  public searchQuery$ = this._searchQuery.asObservable()

  constructor(
    @inject(EventAggregatorTypes.EventAggregator) ea: IEventAggregator,
    @inject(ApiType.NoteApi) private readonly noteApi: INoteApi
  ) {
    super(ea)
  }

  setSearchQuery(query: string): void {
    this._searchQuery.next(query)
  }

  async search(): Promise<void> {
    this.setIsBusy(true)

    const result = await this.noteApi.searchNotes({ query: this._searchQuery.value })

    if (result.isOk) {
      this._notes.next(result.value)
    }

    this.setIsBusy(false)
  }

  async load(): Promise<void> {
    await this.search()
  }
}
