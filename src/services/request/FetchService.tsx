export default class FetchService {
  baseURL: string;

  constructor(config: { baseURL: string }) {
    this.baseURL = config.baseURL;
  }

  private requestInterceptors: Array<
    (url: string, options: RequestInit) => void
  > = [];
  private responseInterceptors: Array<(response: Response) => void> = [];

  async get<T>(option: { url: string; body?: any }): Promise<T> {
    return this._request("GET", option.url, option.body);
  }

  async post<T>(option: { url: string; body?: any }): Promise<T> {
    return this._request("POST", option.url, option.body);
  }

  async put<T>(option: { url: string; body?: any }): Promise<T> {
    return this._request("PUT", option.url, option.body);
  }

  async delete<T>(option: { url: string; body?: any }): Promise<T> {
    return this._request("DELETE", option.url, option.body);
  }

  private async _request<T>(
    method: string,
    url: string,
    body?: any
  ): Promise<T> {
    let options: RequestInit = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    if (body) {
      options.body = JSON.stringify(body);
    }

    this.runRequestInterceptors(url, options);

    const response = await fetch(this.baseURL + url, options);
    this.runResponseInterceptors(response);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data: T = await response.json();
    return data;
  }

  addRequestInterceptor(
    interceptor: (url: string, options: RequestInit) => void
  ) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: (response: Response) => void) {
    this.responseInterceptors.push(interceptor);
  }

  private runRequestInterceptors(url: string, options: RequestInit) {
    this.requestInterceptors.forEach((interceptor) =>
      interceptor(url, options)
    );
  }

  private runResponseInterceptors(response: Response) {
    this.responseInterceptors.forEach((interceptor) => interceptor(response));
  }
}
