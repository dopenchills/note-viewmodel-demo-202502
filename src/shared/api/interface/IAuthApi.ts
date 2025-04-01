import type { IResult } from 'src/shared/result'

export interface IAuthApi {
  signIn(email: string, password: string): Promise<IResult<void>>
  signUp(name: string, password: string): Promise<IResult<void>>
}
