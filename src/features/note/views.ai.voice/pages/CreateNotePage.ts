import { Subscription } from 'rxjs'
import { diContainer } from 'src/di/inversify.config.ts'
import { NoteTypes } from 'src/features/note/view-models/di/NoteTypes'
import type { ICreateNoteViewModel } from 'src/features/note/view-models/interfaces/ICreateNoteViewModel'
import type { IPage, Tool } from 'src/features/shared/views.ai.voice/interfaces/IPage'
import { commonInstruction } from 'src/features/shared/views.ai.voice/pages/commonInstruction'
import { paths } from 'src/shared/constants/paths'

export class CreateNotePage implements IPage {
  readonly id = paths.createNote
  readonly name = 'createNote'

  private viewModel: ICreateNoteViewModel
  private errorMessages: string[] = []
  private subscriptions: Subscription[] = []

  constructor() {
    this.viewModel = diContainer.get<ICreateNoteViewModel>(NoteTypes.CreateNoteViewModel)
  }

  async load(): Promise<void> {
    this.viewModel.setTitle('')
    this.viewModel.setContent('')

    this.subscriptions = [
      this.viewModel.errorMessages$.subscribe((value) => {
        this.errorMessages = value
      }),
    ]
  }

  async unload(): Promise<void> {
    this.subscriptions.forEach((s) => s.unsubscribe())
  }

  getInstructions(): string {
    return `${commonInstruction}
<page>
新規ノート作成ページです。ユーザーと対話しながら、新しいノートを作成します。
</page>

<objective>
- ユーザーからノートのタイトルと本文を聞き取る
- 入力内容を確認してノートを作成する
- 作成後はノート一覧に戻る
</objective>
`
  }

  getTools(): Tool[] {
    return [
      {
        type: 'function',
        name: 'createNote',
        description: 'ノートを作成します',
        parameters: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'ノートのタイトル' },
            content: { type: 'string', description: 'ノートの本文' },
          },
        },
      },
    ]
  }

  async runTool(name: string, args: unknown): Promise<unknown> {
    switch (name) {
      case 'createNote': {
        const { title, content } = args as { title: string; content: string }
        this.viewModel.setTitle(title)
        this.viewModel.setContent(content)
        await this.viewModel.createNote()
        if (this.errorMessages.length > 0) {
          return {
            result: 'success',
            errorMessages: this.errorMessages,
          }
        }
        return {
          success: true,
        }
      }
      default:
        throw new Error(`Unknown tool: ${name}`)
    }
  }
}
