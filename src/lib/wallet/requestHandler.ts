type TRequestConfig = Pick<RequestInit, 'headers'>;
type TResponse<T> = Promise<T & {status: number}>;

export class RequestHandler {
  private baseUrl: string;
  private baseConfig: TRequestConfig;

  constructor(baseUrl='', baseConfig: TRequestConfig = {}) {
    this.baseUrl = baseUrl;
    this.baseConfig = baseConfig;
  }

  public async get<T=any>(endpoint:string, config?:TRequestConfig): TResponse<T> {
    const requestConfig = Object.assign(this.baseConfig, config)
    const response= await fetch(
      this.baseUrl + endpoint,
      {
        method:'GET',
        ...requestConfig
      })

    const data = await response.json();
    return {...data, status: response.status};
  }

  public async post<T=any, TBody=any>(endpoint:string, body:TBody, config?:TRequestConfig): TResponse<T> {
    const requestConfig = Object.assign(this.baseConfig, config)
    const response= await fetch(
      this.baseUrl + endpoint,
      {
        method:'POST',
        body: JSON.stringify(body),
        ...requestConfig
      })

    const data = await response.json();
    return {...data, status: response.status};
  }

  public async patch<T=any, TBody=any>(endpoint:string, body:TBody, config?:TRequestConfig): TResponse<T> {
    const requestConfig = Object.assign(this.baseConfig, config)
    const response= await fetch(
      this.baseUrl + endpoint,
      {
        method:'PATCH',
        body: JSON.stringify(body),
        ...requestConfig
      })

    const data = await response.json();
    return {...data, status: response.status};
  }

  public async delete<T=any>(endpoint:string, config?:TRequestConfig): TResponse<T> {
    const requestConfig = Object.assign(this.baseConfig, config)
    const response= await fetch(
      this.baseUrl + endpoint,
      {
        method:'DELETE',
        ...requestConfig
      })

    const data = await response.json();
    return {...data, status: response.status};
  }
}
