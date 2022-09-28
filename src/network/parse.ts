import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { isArray, isBoolean, isNaN, isNumber, isObject, isString } from '@/utils/type-checks';
import type { JsonParser } from '@/types';

export class Parse {
  static date(input: any): Dayjs | undefined {
    if (input && isString(input))
      return dayjs(input);

    return undefined;
  }

  static number(input: any, { defaultValue = 0 } = {}): number {
    if (input != null) {
      if (isString(input))
        return isNaN(+input) ? defaultValue : +input;

      if (isNumber(input))
        return input;
    }

    return defaultValue;
  }

  static boolean(input: any, { defaultValue = false } = {}): boolean {
    if (input != null) {
      if (isBoolean(input))
        return input;

      if (isNumber(input))
        return input > 0;

      if (isString(input))
        return input === 'true';
    }

    return defaultValue;
  }

  static string(input: any, { defaultValue = '' } = {}): string {
    if (isString(input))
      return input;

    if (input == null)
      return defaultValue;

    return `${input}`;
  }

  static object<T>(input: any, converter: JsonParser<T>) {
    return isObject(input) ? converter(input) : undefined;
  }

  static objectList<T>(input: any, converter: JsonParser<T>) {
    if (!isArray<T>(input))
      return undefined;

    return input
      .map(it => isObject(it) ? converter(it) : null)
      .filter<T>((it): it is T => !!it);
  }
}
