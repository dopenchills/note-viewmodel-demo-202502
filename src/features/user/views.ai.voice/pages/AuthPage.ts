import { Subscription } from 'rxjs'
import { diContainer } from 'src/di/inversify.config.ts'
import type { IPage, Tool } from 'src/features/shared/views.ai.voice/interfaces/IPage'
import { commonInstruction } from 'src/features/shared/views.ai.voice/pages/commonInstruction'
import { UserTypes } from 'src/features/user/view-models/di/UserTypes'
import type { IAuthViewModel } from 'src/features/user/view-models/interfaces/IAuthViewModel'
import type { ISignInViewModel } from 'src/features/user/view-models/interfaces/ISignInViewModel'
import type { ISignOutViewModel } from 'src/features/user/view-models/interfaces/ISignOutViewModel'
import type { ISignUpViewModel } from 'src/features/user/view-models/interfaces/ISignUpViewModel'
import { paths } from 'src/shared/constants/paths'

export class AuthPage implements IPage {
  readonly id = paths.auth
  readonly name = 'AuthPage'

  private authViewModel: IAuthViewModel
  private signInViewModel: ISignInViewModel
  private signUpViewModel: ISignUpViewModel
  private signOutViewModel: ISignOutViewModel
  private userName: string = ''
  private isSignedIn: boolean = false
  private subscriptions: Subscription[] = []

  constructor() {
    this.authViewModel = diContainer.get<IAuthViewModel>(UserTypes.AuthViewModel)
    this.signInViewModel = diContainer.get<ISignInViewModel>(UserTypes.SignInViewModel)
    this.signUpViewModel = diContainer.get<ISignUpViewModel>(UserTypes.SignUpViewModel)
    this.signOutViewModel = diContainer.get<ISignOutViewModel>(UserTypes.SignOutViewModel)
  }

  async load(): Promise<void> {
    await this.authViewModel.load()
    await this.signInViewModel.load()
    await this.signUpViewModel.load()
    await this.signOutViewModel.load()

    this.subscriptions = [
      this.authViewModel.isSignedIn$.subscribe((isSignedIn) => {
        this.isSignedIn = isSignedIn
      }),
      this.signInViewModel.name$.subscribe((name) => {
        this.userName = name
      }),
    ]
  }

  async unload(): Promise<void> {
    this.subscriptions.forEach((s) => s.unsubscribe())
  }

  getInstructions(): string {
    return `${commonInstruction}
<page>
ユーザーは認証ページにいます。あなたはユーザーから認証情報を受け取り、toolに渡すことでログイン、サインアップ、またはサインアウトを試みます。
ユーザーから情報を受け取るたびにgetCurrentStateを使って現在の状態を取得し、ユーザーに適切な指示を送信してください。
</page>
<objective>
ユーザーが認証情報を入力し、正常にサインインすること。
サインアウトを要求された場合は適切にサインアウトすること。

新規登録の場合は、ユーザー名（ひらがな）、メールアドレス、パスワード（英数字4文字）が必要です。
その後にサインインします。
</objective>
`
  }

  getTools(): Tool[] {
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
      {
        type: 'function',
        name: 'signIn',
        description: 'ユーザー名とパスワードでサインインを試みます。',
        parameters: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'ユーザーの名前をひらがなで入力する',
            },
            password: {
              type: 'string',
              description: 'ユーザーのパスワードを小文字の英数字4文字で入力する',
            },
          },
          required: ['name', 'password'],
        },
      },
      {
        type: 'function',
        name: 'signUp',
        description: 'ユーザー名、メールアドレス、パスワードでサインアップを試みます。',
        parameters: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'ユーザーの名前をひらがなで入力する',
            },
            password: {
              type: 'string',
              description: 'ユーザーのパスワードを小文字の英数字4文字で入力する',
            },
          },
          required: ['name', 'password'],
        },
      },
      {
        type: 'function',
        name: 'signOut',
        description: 'サインアウトを試みます。',
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
            isSignedIn: this.isSignedIn,
          },
        }

      case 'signIn': {
        const { name: userName, password } = args as { name: string; password: string }
        this.signInViewModel.setName(userName)
        this.signInViewModel.setPassword(password)
        await this.signInViewModel.signIn()
        return {
          success: this.isSignedIn,
        }
      }

      case 'signUp': {
        const { name: userName, password } = args as {
          name: string
          password: string
        }
        this.signUpViewModel.setName(userName)
        this.signUpViewModel.setPassword(password)
        await this.signUpViewModel.signUp()
        return {
          success: true,
        }
      }

      case 'signOut': {
        await this.signOutViewModel.signOut()
        return {
          success: true,
        }
      }

      default:
        return {
          error: `Tool ${name} not found`,
        }
    }
  }
}
