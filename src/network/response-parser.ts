import type { AxiosError, AxiosResponse } from 'axios';
import type { JsonData, JsonParser } from '@/types';
import { HttpUtils } from '@/network/http-utils';
import { isArray } from '@/utils/type-checks';
import { isEmpty } from '@/utils/utils';
import type { OperationResult } from '@/network/operation-result';
import { OperationError, OperationSuccess } from '@/network/operation-result';
import { Pagination } from '@/network/pagination.response';
import { objectValues } from '@/utils/object';

export class ResponseParser {
  /**
   * Shallow data parse (without nested data property) from backend with itemParser
   * @param response
   * @param itemParser
   */
  static parseShallow<T>(response: AxiosResponse, itemParser?: JsonParser<T>): OperationResult<T> {
    return this._doParse<T>(response, (json: JsonData) => {
      return itemParser ? itemParser(json) : json as T;
    });
  }

  /**
   * Parse data from backend with itemParser
   * @param response
   * @param itemParser
   */
  static parse<T>(response: AxiosResponse, itemParser?: JsonParser<T>): OperationResult<T> {
    return this._doParse<T>(response, (json: JsonData) => {
      const content = json.data;
      if (content == null)
        return null;

      return itemParser ? itemParser(content) : content;
    });
  }

  /**
   * Parse Array of data from backend with itemParser
   * @param response
   * @param itemParser
   */
  static parseList<T>(response: AxiosResponse, itemParser?: JsonParser<T>): OperationResult<T[]> {
    return this._doParse<T[]>(response, (json: JsonData) => {
      const content: T[] = json.data;

      if (!isArray(content))
        return [];

      return itemParser ? content.map(it => itemParser(it)) : content;
    });
  }

  /**
   * Parse paginated data from backend with itemParser
   * @param response
   * @param itemParser
   */
  static parsePaginationList<T>(response: AxiosResponse, itemParser: JsonParser<T>): OperationResult<Pagination<T>> {
    return this.parseShallow(response, Pagination.getConverter(itemParser));
  }

  /**
   * Basic response parse. Returns OperationResult wrapper
   * @param response
   * @param converter
   */
  static _doParse<T>(response: AxiosResponse<T>, converter: JsonParser<T | null>): OperationResult<T> {
    const { data } = response;
    if (!data)
      return new OperationError({ errorMessage: 'Malformed response' });

    if (HttpUtils.isSuccessful(response))
      return new OperationSuccess<T>(converter(data) ?? data as T, response);
    else
      return this.parseError(response);
  }

  /**
   * Parse backend error response. Return OperationError wrapper
   * @param response
   * @param error
   */
  static parseError<T>(response: AxiosResponse, error?: AxiosError): OperationResult<T> {
    const { data } = response;
    let errorMessage = '';
    if (data) {
      if (data.errors && !isArray(data.errors))
        errorMessage = this._parseErrorMessage(data.errors);
      else
        errorMessage = data.message;
    } else if (error) {
      errorMessage = error.message;
    } else {
      errorMessage = 'Неизвестная ошибка';
    }

    return new OperationError({ errorMessage, statusCode: response.status, error: response });
  }

  /**
   * Parse error messages map
   * @param errors
   */
  static _parseErrorMessage(errors: Record<string, string[]>): string {
    if (isEmpty(errors))
      return '';

    let errorsStr = '';

    objectValues(errors).forEach((value) => {
      value.forEach((text) => {
        errorsStr += `<div>${text}</div>`;
      });
    });

    return errorsStr;
  }
}
