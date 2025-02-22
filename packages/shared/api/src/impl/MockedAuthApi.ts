import { type IResult, NotOk, Ok } from 'shared__result'
import type { IAuthApi } from '../interface/IAuthApi'

export class MockedAuthApi implements IAuthApi {
  private readonly authStore: Set<{
    name: string
    email: string
    password: string
  }> = new Set([
    {
      name: 'やまだたろう',
      email: 'yamada.taro@exmample.com',
      password: 'pass',
    },
  ])

  async signIn(name: string, password: string): Promise<IResult<void>> {
    const user = Array.from(this.authStore).find(
      (user) => user.name === name && user.password === password
    )

    if (!user) {
      return new NotOk(new Error('認証に失敗しました'))
    }

    return new Ok(undefined)
  }

  async signUp(name: string, email: string, password: string): Promise<IResult<void>> {
    this.authStore.add({ name, email, password })
    return new Ok(undefined)
  }
}
