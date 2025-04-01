import { CreateNotePage, ListNotePage } from 'src/features/note/views.ai.voice/pages'
import type { IPage, Tool } from 'src/features/shared/views.ai.voice/interfaces'
import { HomePage } from 'src/features/top/views.ai.voice/pages'
import { AuthPage } from 'src/features/user/views.ai.voice/pages'
import { paths } from 'src/shared/constants'

interface INavigationHandler {
  /**
   * Get the current page
   */
  getCurrentPage(): IPage

  /**
   * Initialization of page
   */
  load(): Promise<void>

  /**
   * Get the navigation tool to be used for function calling
   */
  getNavigationTool(): Tool

  /**
   * Run the navigation tool, and update the current page internally
   */
  runNavigationTool(): { result: 'success' | 'failure' }
}

export class NavigationHandler implements INavigationHandler {
  private _currentPage: IPage = new HomePage()

  getCurrentPage(): IPage {
    return this._currentPage
  }

  getNavigationTool(): Tool {
    return {
      type: 'function',
      name: 'next-page',
      description:
        '次のページに移動する。各ページの目的が果たされたら即時実行する。認証されていなかったらノートの管理はできない。',
      parameters: {
        type: 'object',
        properties: {
          nextPage: {
            type: 'string',
            enum: Object.keys(paths),
            description:
              '次のページのID。基本的には指定しなくていいが、特定のページに移動する場合は指定する',
          },
        },
        required: [],
      },
    }
  }

  runNavigationTool(
    nextPagePath?: keyof typeof paths
  ): { result: 'success' } | { result: 'failure'; error: string } {
    if (nextPagePath) {
      switch (paths[nextPagePath]) {
        case paths.top:
          this._currentPage = new HomePage()
          break
        case paths.auth:
          this._currentPage = new AuthPage()
          break
        case paths.notes:
          this._currentPage = new ListNotePage()
          break
        case paths.createNote:
          this._currentPage = new CreateNotePage()
          break
        default:
          return { result: 'failure', error: 'Navigation rule is not defined' }
      }
    } else {
      switch (this._currentPage.id) {
        case paths.top:
          this._currentPage = new AuthPage()
          break
        case paths.auth:
          this._currentPage = new AuthPage()
          break
        case paths.notes:
          this._currentPage = new ListNotePage()
          break
        case paths.createNote:
          this._currentPage = new CreateNotePage()
          break
        default:
          return { result: 'failure', error: 'Navigation rule is not defined' }
      }
    }
    return { result: 'success' }
  }

  async load(): Promise<void> {
    await this._currentPage.load()
  }
}
