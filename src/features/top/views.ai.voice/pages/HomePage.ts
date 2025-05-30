import type { IPage, Tool } from 'src/features/shared/views.ai.voice/interfaces'
import { commonInstruction } from 'src/features/shared/views.ai.voice/pages/commonInstruction'
import { paths } from 'src/shared/constants/paths'

export class HomePage implements IPage {
  readonly id = paths.top
  readonly name = 'HomePage'

  getInstructions(): string {
    return `$${commonInstruction}
<page>
ユーザーからの入力を受け取り、AIチャットを開始します。
</page>
<objective>
ユーザーがAIチャットを開始すること。ユーザーから理解可能な言葉を受け取った瞬間、目的は達成される。
</objective>
`
  }

  getTools(): Tool[] {
    return []
  }

  runTool(): Promise<unknown> {
    throw {
      error: 'No tools available',
    }
  }

  load(): Promise<void> {
    return Promise.resolve()
  }

  unload(): Promise<void> {
    return Promise.resolve()
  }
}
