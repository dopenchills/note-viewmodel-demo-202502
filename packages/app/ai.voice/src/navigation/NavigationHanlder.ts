import type { IPage, Tool } from 'features__shared__views.ai.voice/interfaces'
import { AuthPage } from 'features__user__views.ai.voice/pages'

interface INavigationHandler {
  /**
   * Get the current page
   */
  getCurrentPage(): IPage

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
  private _currentPage: IPage = new AuthPage()

  getCurrentPage(): IPage {
    return this._currentPage
  }

  getNavigationTool(): Tool {
    return {
      type: 'function',
      name: 'next-page',
      description: '次のページに移動する。各ページの目的が果たされたら実行する',
      parameters: {},
    }
  }

  runNavigationTool(): { result: 'success' } | { result: 'failure'; error: string } {
    switch (this._currentPage.id) {
      case 'home':
        this._currentPage = new AuthPage()
        return { result: 'success' }
      case 'auth':
        this._currentPage = new AuthPage()
        return { result: 'success' }
      default:
        return { result: 'failure', error: 'Navigation rule is not defined' }
    }
  }
}
