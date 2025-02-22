import type { IResult } from 'shared__result'

export interface IAuthApi {
  signIn(email: string, password: string): Promise<IResult<void>>
  signUp(name: string, email: string, password: string): Promise<IResult<void>>
}
