export interface IOk<T> {
  isOk: true;
  isNotOk: false;
  value: T;
}

export interface INotOk<E = Error> {
  isOk: false;
  isNotOk: true;
  error: E;
}

export type IResult<T, E = Error> = IOk<T> | INotOk<E>;

export class Ok<T> implements IOk<T> {
  public readonly isOk: true = true;
  public readonly isNotOk: false = false;
  constructor(public readonly value: T) {}
}

export class NotOk<E = Error> implements INotOk<E> {
  public readonly isOk: false = false;
  public readonly isNotOk: true = true;
  constructor(public readonly error: E) {}
}
