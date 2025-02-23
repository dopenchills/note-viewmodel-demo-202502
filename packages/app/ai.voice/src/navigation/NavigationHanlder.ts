import type { IPage, Tool } from 'features__shared__views.ai.voice/interfaces'
import { HomePage } from 'features__top__views.ai.voice/pages'
import { AuthPage } from 'features__user__views.ai.voice/pages'
import { paths } from 'shared__constants'

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
      description: '次のページに移動する。各ページの目的が果たされたら即時実行する',
      parameters: {},
    }
  }

  runNavigationTool(): { result: 'success' } | { result: 'failure'; error: string } {
    switch (this._currentPage.id) {
      case paths.top:
        this._currentPage = new AuthPage()
        return { result: 'success' }
      case paths.auth:
        this._currentPage = new AuthPage()
        return { result: 'success' }
      default:
        return { result: 'failure', error: 'Navigation rule is not defined' }
    }
  }

  async load(): Promise<void> {
    await this._currentPage.load()
  }
}
