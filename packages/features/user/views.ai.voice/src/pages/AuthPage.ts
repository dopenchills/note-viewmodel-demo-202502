import { diContainer } from 'di'
import { IPage } from 'features__shared__views.ai.voice/interfaces'
import { IAuthViewModel, ISignInViewModel, UserTypes } from 'features__user__view-models'
import { commonInstruction } from './commonInstruction'

type AuthTool =
  | {
      type: 'function'
      name: 'getCurrentState'
      description: string
      parameters: {
        type: 'object'
        properties: Record<never, never>
        required: never[]
      }
    }
  | {
      type: 'function'
      name: 'signIn'
      description: string
      parameters: {
        type: 'object'
        properties: {
          name: {
            type: 'string'
            description: 'ユーザーの名前をひらがなで入力する'
          }
          password: {
            type: 'string'
            description: 'ユーザーのパスワードを小文字の英数字4文字で入力する'
          }
        }
        required: ['name', 'password']
      }
    }

type AuthToolResults = {
  getCurrentState: {
    state: {
      name: string
      email: string
      isSignedIn: boolean
    }
  }
  signIn: {
    success: boolean
  }
}

export class AuthPage implements IPage<AuthTool, AuthToolResults> {
  readonly id = 'auth'
  readonly name = 'AuthPage'

  private authViewModel: IAuthViewModel
  private signInViewModel: ISignInViewModel

  private userName: string
  private email: string
  private isSignedIn: boolean

  constructor() {
    this.authViewModel = diContainer.get<IAuthViewModel>(UserTypes.AuthViewModel)
    this.signInViewModel = diContainer.get<ISignInViewModel>(UserTypes.SignInViewModel)

    this.authViewModel.isSignedIn$.subscribe((isSignedIn) => {
      this.isSignedIn = isSignedIn
    })
    this.signInViewModel.name$.subscribe((name) => {
      this.userName = name
    })
    this.signInViewModel.email$.subscribe((email) => {
      this.email = email
    })
  }

  getInstructions(): string {
    return `${commonInstruction}
<page>
ユーザーは認証ページにいます。あなたはユーザーから認証情報を受け取り、toolに渡すことでログインを試みます。
ユーザーから情報を受け取るたびにgetCurrentStateを使って現在の状態を取得し、ユーザーに適切な指示を送信してください。
</page>
`
  }

  getTools(): AuthTool[] {
    return [
      {
        type: 'function',
        name: 'getCurrentState',
        description:
          '現在の状態を取得します。このページでは主に認証情報を取得するために使用します。',
        parameters: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
    ]
  }

  async runTool(name: string, args: unknown): Promise<unknown> {
    switch (name) {
      case 'getCurrentState':
        return {
          state: {
            name: this.userName,
            email: this.email,
            isSignedIn: this.isSignedIn,
          },
        }
      case 'signIn': {
        const signInArgs = args as { name: string; password: string }
        this.signInViewModel.setName(signInArgs.name)
        this.signInViewModel.setPassword(signInArgs.password)
        await this.signInViewModel.signIn()
        return {
          success: this.isSignedIn,
        }
      }
      default:
        throw new Error(`Unknown tool: ${name}`)
    }
  }
}
