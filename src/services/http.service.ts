export interface RequestOptions extends RequestInit {
  noJSON?: boolean;
}

export class HttpService {
  constructor(protected options: RequestInit = {}) {}

  get<T>(url: string, options?: RequestOptions) {
    return this.request<T>(url, "GET", options);
  }
  post<T, Body = any>(url: string, body?: Body, options: RequestOptions = {}) {
    return this.request<T>(url, "POST", {
      ...options,
      body: this.prepareBody(body, options),
    });
  }

  delete<T = void>(url: string, options?: RequestOptions) {
    return this.request<T>(url, "DELETE", { ...options, noJSON: true });
  }

  put<T>(url: string, options?: RequestOptions) {
    return this.request<T>(url, "PUT", options);
  }

  patch<T, Body = any>(url: string, body?: Partial<Body>, options: RequestOptions = {}) {
    return this.request<T>(url, "PATCH", {
      ...options,
      body: this.prepareBody(body, options),
    });
  }

  protected request<T>(url: string, method: string, options: RequestOptions = {}): Promise<T> {
    return fetch(url, {
      ...this.options,
      ...options,
      method,
    } as RequestInit).then(res => {
      return options.noJSON ? res.text() : res.json();
    });
  }

  private prepareBody(body: any, options: RequestOptions) {
    return typeof body === "object" ? JSON.stringify(body) : body || options.body;
  }
}
