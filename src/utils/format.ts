import dayjs from 'dayjs';
import { numOr0 } from '@/utils/utils';
import { truncate } from '@/utils/lodash';

export function formatPhone(str: string) {
  if (!str)
    return str;
  // Filter only numbers from the input
  const cleaned = (`${str}`).replace(/\D/g, '');
  // Check if the input is of correct
  const match = cleaned.match(/^(7|)?(\d{3})(\d{3})(\d{2})(\d{2})$/);

  return match ? ['+7', ' ', match[2], ' ', match[3], ' ', match[4], ' ', match[5]].join('') : str;
}

function toStingTrim(value: string | number) {
  return `${value}`.trim();
}

type formatMethod = 'num' | 'datetime' | 'date' | 'time' | 'phone' | 'yesno' | 'truncate' | 'empty';

export function format(value: any, method: formatMethod, options?: string | object): string {
  switch (method) {
    case 'num':
      return numOr0(value).toString();
    case 'datetime':
      return dayjs(value).format('HH:mm DD.MM.YYYY');
    case 'date':
      return dayjs(value).format('DD.MM.YYYY');
    case 'time':
      return dayjs(value).format('HH:mm');
    case 'phone':
      return formatPhone(toStingTrim(value));
    case 'yesno':
      return value ? 'Да' : 'Нет';
    case 'truncate':
      return truncate(toStingTrim(value), Object.assign({ length: 50, separator: '...' }, options));
    case 'empty':
      return value || options || 'Данных нет';
    default:
      return toStingTrim(value);
  }
}
