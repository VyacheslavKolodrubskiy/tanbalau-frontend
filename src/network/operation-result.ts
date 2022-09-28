import type { AxiosError, AxiosResponse } from 'axios';
import { ResponseParser } from '@/network/response-parser';

export abstract class OperationResult<T> {
  response?: AxiosResponse<T>;
  constructor(public data: T) {}
  get isSuccessful(): boolean {
    return this instanceof OperationSuccess;
  }

  get isUnsuccessful(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return this instanceof OperationError;
  }

  static fromError<T>(error: any): OperationResult<T> {
    try {
      if (error instanceof OperationCancelled)
        return error as OperationResult<T>;

      const { response, request, message } = error as AxiosError;

      if (response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // console.log(response.data);
        // console.log(response.status);
        // console.log(response.headers);

        return ResponseParser.parseError(response, error);
      }

      if (request) {
        // The request was made but no response was received
        // `request` is an instance of XMLHttpRequest in the browser

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return new OperationError({
          errorTitle: 'Ошибка сервера',
          errorMessage: 'Что-то пошло не так на сервере. Пожалуйста, попробуйте ещё раз позднее',
        });
      }

      // Something happened in setting up the request that triggered an Error
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return new OperationError({ errorMessage: message });
    } catch {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return new OperationError({ errorMessage: 'Неизвестная ошибка', error });
    }
  }
}

export class OperationSuccess<T> extends OperationResult<T> {
  constructor(data: T, response: AxiosResponse<T>) {
    super(data);
    this.response = response;
  }
}

interface IOperationError {
  errorTitle?: string
  errorMessage?: string
  error?: any
  statusCode?: number
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface OperationError<T> extends IOperationError {}

export class OperationError<T> extends OperationResult<T> {
  constructor(props: IOperationError) {
    super({} as T);
    Object.assign(this, props);
  }

  toString(): string {
    return `OperationError(title: ${this.errorTitle}, message: ${this.errorMessage})`;
  }
}

export class OperationCancelled<T> extends OperationResult<T> {}
