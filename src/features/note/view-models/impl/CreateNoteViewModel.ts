import { inject, injectable } from 'inversify'
import { BehaviorSubject } from 'rxjs'
import type { ICreateNoteViewModel } from 'src/features/note/view-models/interfaces/ICreateNoteViewModel'
import { ApiType } from 'src/shared/api/di/ApiType'
import type { INoteApi } from 'src/shared/api/interface/INoteApi'
import { EventAggregatorTypes } from 'src/shared/event-aggregator/di/EventAggregatorTypes'
import type { IEventAggregator } from 'src/shared/event-aggregator/interfaces/IEventAggregator'
import { ViewModelBase } from 'src/shared/view-models/base/ViewModelBase'

@injectable()
export class CreateNoteViewModel extends ViewModelBase implements ICreateNoteViewModel {
  private _title: BehaviorSubject<string> = new BehaviorSubject('')
  public title$ = this._title.asObservable()

  private _content: BehaviorSubject<string> = new BehaviorSubject('')
  public content$ = this._content.asObservable()

  private _errorMessages: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])
  public errorMessages$ = this._errorMessages.asObservable()

  constructor(
    @inject(EventAggregatorTypes.EventAggregator) ea: IEventAggregator,
    @inject(ApiType.NoteApi) private readonly noteApi: INoteApi
  ) {
    super(ea)
  }

  private reset(): void {
    this._title.next('')
    this._content.next('')
    this._errorMessages.next([])
  }

  setTitle(title: string): void {
    this._title.next(title)
    this._errorMessages.next([]) // Clear errors on input change
  }

  setContent(content: string): void {
    this._content.next(content)
    this._errorMessages.next([]) // Clear errors on input change
  }

  async createNote(): Promise<void> {
    this.setIsBusy(true)
    try {
      if (!this._title.value.trim()) {
        this._errorMessages.next(['タイトルは必須です'])
        return
      }

      if (!this._content.value.trim()) {
        this._errorMessages.next(['内容は必須です'])
        return
      }

      const result = await this.noteApi.createNote({
        title: this._title.value,
        content: this._content.value,
      })

      if (result.isOk) {
        this.reset()
      } else {
        this._errorMessages.next(['ノート作成に失敗しました'])
      }
    } finally {
      this.setIsBusy(false)
    }
  }

  async load(): Promise<void> {
    this.reset()
  }
}
