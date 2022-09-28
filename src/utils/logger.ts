export class Logger {
  constructor(private _tag: string, private _isDevOnly = true) {}

  log(message: string) {
    // TODO add time if need
    // TODO add isDev check
    if (this._isDevOnly)
      console.log(`[${this._tag}]: ${message}`);
  }
}
