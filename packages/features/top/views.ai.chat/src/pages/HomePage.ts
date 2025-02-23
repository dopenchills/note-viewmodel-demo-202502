import type { IPage, Tool } from 'features__shared__views.ai.voice/interfaces'
import { commonInstruction } from 'features__shared__views.ai.voice/pages'
import { paths } from 'shared__constants'

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
}
