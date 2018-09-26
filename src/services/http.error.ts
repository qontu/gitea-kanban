export class HTTPError extends Error {
  res: Response;
  constructor(reason: string, res: Response) {
    super(`${res.statusText}` + reason ? `: ${reason}` : "");
    this.res = res;
  }
}
