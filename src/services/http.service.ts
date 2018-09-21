export class HttpService {
  constructor(protected options: RequestInit = {}) {}

  get(url: string, options?: RequestInit) {
    return this.request(url, "GET", options);
  }
  post(url: string, body?: any, options: RequestInit = {}) {
    return this.request(url, "POST", {
      ...options,
      body: typeof body === "object" ? JSON.stringify(body) : body || options.body,
    });
  }

  delete(url: string, options?: RequestInit) {
    return this.request(url, "DELETE", options);
  }

  put(url: string, options?: RequestInit) {
    return this.request(url, "PUT", options);
  }

  protected request(url: string, method: string, options?: RequestInit) {
    return fetch(url, {
      ...(options || this.options || {}),
      method,
    }).then(res => res.json());
  }
}
