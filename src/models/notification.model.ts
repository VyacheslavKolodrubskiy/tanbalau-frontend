import type { JsonParser } from '@/types';
import { Parse } from '@/network/parse';
import { format } from '@/utils/format';

export interface INotification {
  id?: string
  type?: number
  message?: string
  createdAt?: string
}

// Hack for combine destructuring with parameter properties
// https://github.com/microsoft/TypeScript/issues/5326
export interface Notification extends INotification {}

export class Notification {
  constructor(props: INotification) {
    Object.assign(this, props);
  }

  static fromJson: JsonParser<Notification> = (json) => {
    return new Notification({
      id: Parse.string(json.id),
      type: Parse.number(json.type),
      message: Parse.string(json.message),
      createdAt: format(Parse.string(json.created_at), 'date'),
    });
  };
}
