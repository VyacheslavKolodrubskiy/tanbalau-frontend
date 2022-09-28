import type { AxiosResponse } from 'axios';

export class HttpUtils {
  static isSuccessful(response: AxiosResponse): boolean {
    return response.status >= 200 && response.status < 300;
  }
}
