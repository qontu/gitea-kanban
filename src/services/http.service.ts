export class HttpService {
  constructor(protected options: RequestInit = {}) {}

  get<T>(url: string, options?: RequestInit) {
    return this.request<T>(url, "GET", options);
  }
  post<T, Body = any>(url: string, body?: Body, options: RequestInit = {}) {
    return this.request<T>(url, "POST", {
      ...options,
      body: this.prepareBody(body, options),
    });
  }

  delete<T = void>(url: string, options?: RequestInit) {
    return this.request<T>(url, "DELETE", options, true);
  }

  put<T>(url: string, options?: RequestInit) {
    return this.request<T>(url, "PUT", options);
  }

  patch<T, Body = any>(url: string, body?: Partial<Body>, options: RequestInit = {}) {
    return this.request<T>(url, "PATCH", {
      ...options,
      body: this.prepareBody(body, options),
    });
  }

  protected request<T>(url: string, method: string, options: RequestInit = {}, noBody: boolean = false): Promise<T> {
    return fetch(url, {
      ...this.options,
      ...options,
      method,
    })
      .then(res => {
        return noBody ? null : res.json();
      })
      .catch(console.error);
  }

  private prepareBody(body: any, options: RequestInit) {
    return typeof body === "object" ? JSON.stringify(body) : body || options.body;
  }
}
