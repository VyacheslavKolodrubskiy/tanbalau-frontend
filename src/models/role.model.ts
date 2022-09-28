import type { JsonParser } from '@/types';
import { Parse } from '@/network/parse';

export interface IRole {
  id: number
  title: string
}

// Hack for combine destructuring with parameter properties
// https://github.com/microsoft/TypeScript/issues/5326
export interface Role extends IRole {}

export class Role {
  constructor(props: IRole) {
    Object.assign(this, props);
  }

  static fromJson: JsonParser<Role> = (json) => {
    return new Role({
      id: Parse.number(json.id),
      title: Parse.string(json.title),
    });
  };
}
