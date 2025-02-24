import { diContainer } from 'di'
import type { IListNoteViewModel } from 'features__note__view-models'
import { NoteTypes } from 'features__note__view-models'
import { IPage, Tool } from 'features__shared__views.ai.voice/interfaces'
import { commonInstruction } from 'features__shared__views.ai.voice/pages'
import { Subscription } from 'rxjs'
import type { Note } from 'shared__api'
import { paths } from 'shared__constants'

export class ListNotePage implements IPage {
  readonly id = paths.notes
  readonly name = 'ListNotePage'

  private viewModel: IListNoteViewModel
  private notes: Note[] = []
  private subscriptions: Subscription[] = []

  constructor() {
    this.viewModel = diContainer.get<IListNoteViewModel>(NoteTypes.ListNoteViewModel)
  }

  async load(): Promise<void> {
    await this.viewModel.search()

    this.subscriptions = [
      this.viewModel.notes$.subscribe((value) => {
        this.notes = value
      }),
    ]
  }

  async unload(): Promise<void> {
    this.subscriptions.forEach((s) => s.unsubscribe())
  }

  getInstructions(): string {
    return `${commonInstruction}
<page>
ノート一覧ページです。ユーザーのノートを表示し、検索機能を提供します。
</page>

<objective>
- ユーザーのノートを表示する
- ノートの検索をサポートする
- 新規ノート作成への案内をする
</objective>
`
  }

  getTools(): Tool[] {
    return [
      {
        type: 'function',
        name: 'searchNotes',
        description: 'ノートを検索します',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: '検索キーワード',
            },
          },
          required: ['query'],
        },
      },
    ]
  }

  async runTool(name: string, args: unknown): Promise<unknown> {
    switch (name) {
      case 'searchNotes': {
        const { query } = args as { query: string }
        this.viewModel.setSearchQuery(query)
        await this.viewModel.search()

        return {
          result: 'success',
          notes: this.notes,
        }
      }
      default:
        throw new Error(`Unknown tool: ${name}`)
    }
  }
}
