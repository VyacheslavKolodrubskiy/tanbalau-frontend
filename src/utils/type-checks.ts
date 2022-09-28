export function getRawType(value: unknown): string {
  // returns original type of value
  // (boolean, number, string, symbol, function, object, array, set, map, error, date, regexp)
  const { toString } = Object.prototype;
  const str = toString.call(value);

  return str.slice(8, -1).toLowerCase();
}

export const isString = (value: unknown): value is string => getRawType(value) === 'string';
export const isNumber = (value: unknown): value is number => getRawType(value) === 'number';
export const isBoolean = (value: unknown): value is boolean => getRawType(value) === 'boolean';
export const isObject = (value: unknown): value is Record<string | number, any> => getRawType(value) === 'object';
export const isArray = <T = any>(value: unknown): value is T[] => getRawType(value) === 'array';
// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = <T extends Function>(value: unknown): value is T => getRawType(value) === 'function';
export const isFile = (value: unknown) => getRawType(value) === 'file';

// An `NaN` primitive is the only value that is not equal to itself.
export const isNaN = (value: unknown): boolean => isNumber(value) && value !== +value;
export const isNil = (value: unknown): boolean => value == null;
