export interface IOk<T> {
  isOk: true
  isNotOk: false
  value: T
}

export interface INotOk<E = Error> {
  isOk: false
  isNotOk: true
  error: E
}

export type IResult<T, E = Error> = IOk<T> | INotOk<E>

export class Ok<T> implements IOk<T> {
  public readonly isOk = true as const
  public readonly isNotOk = false as const
  constructor(public readonly value: T) {}
}

export class NotOk<E = Error> implements INotOk<E> {
  public readonly isOk = false as const
  public readonly isNotOk = true as const
  constructor(public readonly error: E) {}
}
