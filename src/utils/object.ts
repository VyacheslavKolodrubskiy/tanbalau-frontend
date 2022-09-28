import { notNullish } from '@/utils/guards';
import type { BaseObj } from '@/types';

/**
 * Map key/value pairs for an object, and construct a new one
 *
 *
 * @category Object
 *
 * Transform:
 * @example
 * ```
 * objectMap({ a: 1, b: 2 }, (k, v) => [k.toString().toUpperCase(), v.toString()])
 * // { A: '1', B: '2' }
 * ```
 *
 * Swap key/value:
 * @example
 * ```
 * objectMap({ a: 1, b: 2 }, (k, v) => [v, k])
 * // { 1: 'a', 2: 'b' }
 * ```
 *
 * Filter keys:
 * @example
 * ```
 * objectMap({ a: 1, b: 2 }, (k, v) => k === 'a' ? undefined : [k, v])
 * // { b: 2 }
 * ```
 */

export function objectMap<K extends string, V, NK = K, NV = V>(obj: Record<K, V>, fn: (key: K, value: V) => [NK, NV] | undefined): Record<K, V> {
  return Object.fromEntries(
    Object.entries(obj)
      .map(([k, v]) => fn(k as K, v as V))
      .filter(notNullish),
  );
}

export function fastClone<T extends object>(val: T): T {
  return JSON.parse(JSON.stringify(val));
}

export const objectKeys = Object.keys as ObjectConstructor['keys'];
// export const objectKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

export const objectValues = Object.values as ObjectConstructor['values'];
// export const objectValues = Object.values as <T extends object>(obj: T) => Array<T[keyof T]>;

export const objectEntries = Object.entries as ObjectConstructor['entries'];
// export const objectEntries = Object.entries as <T extends object>(obj: T) => Array<[keyof T, T[keyof T]]>;

// Clear undefined fields from an object. It mutates the object
export function clearUndefined(obj: BaseObj) {
  objectKeys(obj).forEach(key => (obj[key] === undefined ? delete obj[key] : {}));
  return obj;
}
