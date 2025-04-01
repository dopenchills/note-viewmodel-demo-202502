import type { IAuthApi } from 'src/shared/api/interface/IAuthApi'
import { NotOk, Ok, type IResult } from 'src/shared/result'

export class MockedAuthApi implements IAuthApi {
  private readonly authStore: Set<{
    name: string
    password: string
  }> = new Set([
    {
      name: 'やまだたろう',
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

  async signUp(name: string, password: string): Promise<IResult<void>> {
    this.authStore.add({ name, password })
    return new Ok(undefined)
  }
}
