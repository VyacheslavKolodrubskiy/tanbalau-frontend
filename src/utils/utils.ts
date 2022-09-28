import { isArray, isNaN, isNil, isNumber, isObject, isString } from '@/utils/type-checks';
import type { AppTypeInterface } from '@/config/types';
import {
  APPLICATION_STATUSES,
  GROUP_STATUSES,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PRINT_STATUSES,
  PRODUCT_STATUSES,
} from '@/config/types';
import type { BaseObj } from '@/types';

export function fastClone(val: object) {
  return JSON.parse(JSON.stringify(val));
}

export function isEmpty(val: any): boolean {
  if (!val)
    return true; // null, undefined, empty string, false, 0: returns true
  if (isArray(val))
    return !val.length;
  if (isObject(val))
    return !Object.keys(val).length;

  return false;
}

export function removeEmpty(obj: object, removeEmptyStrings = false) {
  if (!obj)
    return {};

  return Object.entries(obj)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, v]) => v != null && (removeEmptyStrings ? v !== '' : true))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
}

export function removeEmptyObjInArray(arr: any[]) {
  if (!Array.isArray(arr))
    return {};

  return arr
    .map(item => removeEmpty(item, true))
    .filter(el => Object.keys(el).length);
}

export function numOr0(number: any, throwError = false) {
  if (isNil(number))
    return 0;
  if (isNumber(number))
    return number;

  if (isString(number)) {
    let tmpNumber = +number;

    if (isNaN(tmpNumber)) {
      if (throwError)
        throw new Error('Wrong number formatting');

      number = number.replace(/\s/g, '');
      number = number.replace(',', '.');
      number = +number;
      tmpNumber = isNaN(number) ? 0 : number;
    }

    if (throwError)
      throw new Error('Wrong number formatting');

    return tmpNumber;
  }

  // throw
  return 0;
}

// export function clamp(n: number, min: number, max: number) {
//   return Math.min(max, Math.max(min, n));
// }

export function getTextWithHighlights(text: string, searchText: string): string {
  const regex = new RegExp(searchText, 'gi');
  return text.replace(regex, '<mark class="bg-gray-400 p-0">$&</mark>');
}

export function extendForSelect(obj: BaseObj, label = 'title', value = 'id') {
  return { ...obj, label: obj[label], value: obj[value] };
}

function getStatusVariant<T extends object>(types: T, statusId?: number) {
  const status = Object.values(types).find(status => (status as AppTypeInterface).id === statusId);
  if (!status)
    return 'gray';

  return (status as AppTypeInterface).variant;
}

export function getOrderStatusVariant(statusId?: number) {
  return getStatusVariant(ORDER_STATUSES, statusId);
}

export function getGroupStatusVariant(statusId?: number) {
  return getStatusVariant(GROUP_STATUSES, statusId);
}

export function getProductStatusVariant(statusId?: number) {
  return getStatusVariant(PRODUCT_STATUSES, statusId);
}

export function getApplicationStatusVariant(statusId?: number) {
  return getStatusVariant(APPLICATION_STATUSES, statusId);
}

export function getPrintStatusVariant(statusId?: number) {
  return getStatusVariant(PRINT_STATUSES, statusId);
}

export function getPaymentStatusVariant(statusId?: number) {
  return getStatusVariant(PAYMENT_STATUSES, statusId);
}

export function appendRecursive(
  form: FormData,
  data: Record<string | number, any>,
  wrapper?: string,
) {
  for (const key in data) {
    if (!Object.prototype.hasOwnProperty.call(data, key))
      return;

    const value = data[key];

    if (value === undefined)
      continue;

    if (value && (typeof value === 'object') && !(value instanceof File))
      appendRecursive(form, value, wrapper ? `${wrapper}[${key}]` : key);
    else
      form.append(wrapper ? `${wrapper}[${key}]` : key, value);
  }

  return form;
}
