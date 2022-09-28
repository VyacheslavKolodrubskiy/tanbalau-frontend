import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from 'axios';
import axios from 'axios';
import type { BaseObj } from '@/types';
import { HttpMethod } from '@/types';
import { appendRecursive, removeEmpty } from '@/utils/utils';
import { isNil } from '@/utils/type-checks';
import router from '@/router';
import { DEFAULT_LOGGED_OUT_ROUTE_NAME } from '@/config/constants';
import { objectKeys } from '@/utils/object';
import { useAuthStore } from '@/stores/auth.store';

const enum StatusCode {
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  TooManyRequests = 429,
  InternalServerError = 500,
}

const headers: Readonly<AxiosRequestHeaders> = {
  'Accept': 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
};

// class HttpError extends Error {
//   constructor(message) {
//     super(message);
//   }
// }
class Http {
  private readonly instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      // timeout: 5000,
      // Если появится необходимость делать запросы без baseURL, его можно перенести в Ececutor,
      // в AxiosRequestConfig параметром по умолчанию
      baseURL,
      headers,
    });

    this._initializeInterceptors();
  }

  // We can use the following function to inject the JWT token through an interceptor
  // We get the `accessToken` from the localStorage that we set when we authenticate
  private _handleRequest(config: AxiosRequestConfig): AxiosRequestConfig {
    const authStore = useAuthStore();

    if (authStore.token != null && config.headers)
      config.headers.Authorization = `Bearer ${authStore.token}`;

    return config;
  }

  private _handleRequestError = (error: AxiosError) => Promise.reject(error);
  private _handleResponse = (response: AxiosResponse) => response;
  private _handleResponseError(error: AxiosError) {
    const { response } = error;

    if (response)
      this.handleError(response.status);

    return Promise.reject(error);
  }

  private _initializeInterceptors() {
    this.instance.interceptors.request.use(this._handleRequest, this._handleRequestError);
    this.instance.interceptors.response.use(this._handleResponse, this._handleResponseError.bind(this));
  }

  // Handle global app errors
  // We can handle generic app errors depending on the status code
  protected handleError(status: AxiosResponse['status']) {
    switch (status) {
      case StatusCode.InternalServerError: {
        // Handle InternalServerError
        break;
      }
      case StatusCode.Forbidden: {
        // Handle Forbidden
        break;
      }
      case StatusCode.Unauthorized: {
        const authStore = useAuthStore();
        authStore.logout();
        if (router.currentRoute.value.fullPath === `/${DEFAULT_LOGGED_OUT_ROUTE_NAME}`)
          router.push({ name: DEFAULT_LOGGED_OUT_ROUTE_NAME });
        else
          router.push({ name: DEFAULT_LOGGED_OUT_ROUTE_NAME, query: { redirect: router.currentRoute.value.fullPath } });

        break;
      }
      case StatusCode.TooManyRequests: {
        // Handle TooManyRequests
        break;
      }
    }
  }

  private _shallowNullNormalize<T = BaseObj>(data: T): T {
    const shallowClone = Object.assign({}, data);

    objectKeys(shallowClone).forEach((key) => {
      shallowClone[key] = isNil(shallowClone[key]) ? null : shallowClone[key];
    });

    return shallowClone;
  }

  private _baseRequest<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
    // todo caching

    if (config.params)
      config.params = removeEmpty(config.params, true);

    return this.instance.request(config);
  }

  request<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
    let { data } = config;
    data = this._shallowNullNormalize(data);
    return this._baseRequest<T, R>({ ...config, data });
  }

  formDataRequest<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
    let { method, data } = config;

    if (method !== HttpMethod.POST) {
      data = this._shallowNullNormalize(data);
      data = appendRecursive(new FormData(), { _method: method, ...data });
      method = HttpMethod.POST;
    }

    return this._baseRequest<T, R>({ ...config, method, data });
  }
  // get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
  //   return this.http.get<T, R>(url, config);
  // }
  //
  // post<T = any, R = AxiosResponse<T>>(
  //   url: string,
  //   data?: T,
  //   config?: AxiosRequestConfig,
  // ): Promise<R> {
  //   return this.http.post<T, R>(url, data, config);
  // }
  //
  // put<T = any, R = AxiosResponse<T>>(
  //   url: string,
  //   data?: T,
  //   config?: AxiosRequestConfig,
  // ): Promise<R> {
  //   return this.http.put<T, R>(url, data, config);
  // }
  //
  // delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
  //   return this.http.delete<T, R>(url, config);
  // }
}

export const http = new Http(import.meta.env.VITE_SERVER_URL as string);
