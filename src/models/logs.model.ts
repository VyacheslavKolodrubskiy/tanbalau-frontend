import type { JsonParser } from '@/types';
import { Parse } from '@/network/parse';

export interface ILogs {
  created_at: string
  id: number
  loggable_id: number
  loggable_type: string
  new_data?: ILogs[]
  previous_data?: ILogs[]
  title: string
  type: number
  updated_at: string
  user_id: number
}

// Hack for combine destructuring with parameter properties
// https://github.com/microsoft/TypeScript/issues/5326
export interface Logs extends ILogs {}

export class Logs {
  constructor(props: ILogs) {
    Object.assign(this, props);
  }

  static fromJson: JsonParser<Logs> = (json) => {
    return new Logs({
      created_at: Parse.string(json.created_at),
      id: Parse.number(json.id),
      loggable_id: Parse.number(json.loggable_id),
      loggable_type: Parse.string(json.loggable_type),
      new_data: Parse.objectList(json.new_data, Logs.fromJson),
      previous_data: Parse.objectList(json.previous_data, Logs.fromJson),
      title: Parse.string(json.title),
      type: Parse.number(json.type),
      updated_at: Parse.string(json.updated_at),
      user_id: Parse.number(json.user_id),
    });
  };
}
