import type { IPage, Tool } from 'features__shared__views.ai.voice/interfaces'
import { commonInstruction } from 'features__shared__views.ai.voice/pages'

export class HomePage implements IPage {
  readonly id = 'home'
  readonly name = 'HomePage'

  getInstructions(): string {
    return `$${commonInstruction}
<page>
ユーザーからの入力を受け取り、AIチャットを開始します。
</page>
<objective>
ユーザーがAIチャットを開始すること。
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
}
