export interface ISuccessResult<T> {
  isOk: true;
  isError: false;
  value: T;
}

export interface IFailureResult<E = Error> {
  isOk: false;
  isError: true;
  error: E;
}

export type IResult<T, E = Error> = ISuccessResult<T> | IFailureResult<E>;

export class SuccessResult<T> implements ISuccessResult<T> {
  public readonly isOk: true = true;
  public readonly isError: false = false;
  constructor(public readonly value: T) {}
}

export class FailureResult<E = Error> implements IFailureResult<E> {
  public readonly isOk: false = false;
  public readonly isError: true = true;
  constructor(public readonly error: E) {}
}
