interface HttpClientConfig {
    baseUrl: string;
    accessToken?: string;
    refreshToken?: string;
    onTokenRefresh?: (tokens: { accessToken: string, refreshToken: string }) => void;
}

export class HttpClient {
  private isRefreshingToken = false;
  private refreshTokenPromise: Promise<{ accessToken: string, refreshToken: string } | null> | null = null;

  constructor(
        private config: HttpClientConfig
  ) {}

  // -------------------------------PUBLIC--------------------------------- //

  public get<T>(url: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(url, {
      method: 'GET',
      headers: this.getHeaders(headers)
    });
  }

  public post<T, U>(url: string, body: U, headers?: HeadersInit): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getHeaders(headers)
      },
      body: JSON.stringify(body)
    });
  }

  public patch<T, U>(url: string, body: U, headers?: HeadersInit): Promise<T> {
    return this.request<T>(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.getHeaders(headers)
      },
      body: JSON.stringify(body)
    });
  }

  public delete<T>(url: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(url, {
      method: 'DELETE',
      headers: this.getHeaders(headers)
    });
  }

  // -------------------------------PRIVATE--------------------------------- //

  private async request<T>(url: string, options: RequestInit, retry = true): Promise<T> {
    const response = await fetch(this.config.baseUrl + url, options);
    const result = await response.json();

    if(response.status === 401 && retry) {
      // Handle token refresh
      const tokens = await this.getRefreshToken();
      if(tokens) {
        this.config.accessToken = tokens.accessToken;
        this.config.refreshToken = tokens.refreshToken;

        // Retry the request with new access token
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${tokens.accessToken}`
        };
        return this.request<T>(url, options, false);
      }
    }

    if(!response.ok) {
      const error = result as { message: string };
      throw new Error(error.message || 'Something went wrong');
    }
    return result as T;
  }

  private async getRefreshToken(): Promise<{ accessToken: string, refreshToken: string } | null> {
    if(this.isRefreshingToken) {
      // Wait for the ongoing token refresh process to complete
      return this.refreshTokenPromise!;
    }

    this.isRefreshingToken = true;
    this.refreshTokenPromise = this.refreshToken().finally(() => {
      this.isRefreshingToken = false;
      this.refreshTokenPromise = null;
    });

    return this.refreshTokenPromise;
  }

  private async refreshToken(): Promise<{ accessToken: string, refreshToken: string } | null> {
    if(!this.config.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(this.config.baseUrl + '/auth/refresh', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.refreshToken}`
      }
    });

    if(!response.ok) {
      return null;
    }

    const tokens = await response.json();
    if(this.config.onTokenRefresh) {
      this.config.onTokenRefresh(tokens);
    }
    return tokens;
  }

  private getHeaders(headers?: HeadersInit): HeadersInit {
    return {
      'Authorization': this.config.accessToken ? `Bearer ${this.config.accessToken}` : '',
      ...headers
    };
  }
}
