export class ViewModelBase {
  private _isBusy: boolean = false;

  get isBusy(): boolean {
    return this._isBusy;
  }

  setIsBusy(isBusy: boolean): void {
    this._isBusy = isBusy;
  }
}
