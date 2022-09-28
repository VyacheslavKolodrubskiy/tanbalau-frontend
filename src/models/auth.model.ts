import { mask } from 'maska';
import type { JsonParser } from '@/types';
import { Parse } from '@/network/parse';

export interface IAuth {
  name?: string
  email?: string
  phone?: string
  iin?: string
  password?: string
  password_confirmation?: string
}

// Hack for combine destructuring with parameter properties
// https://github.com/microsoft/TypeScript/issues/5326
export interface Auth extends IAuth {}

export class Auth {
  constructor(props: IAuth) {
    Object.assign(this, props);
  }

  static fromJson: JsonParser<Auth> = (json) => {
    return new Auth({
      name: Parse.string(json.name),
      email: Parse.string(json.email),
      phone: mask(Parse.string(json.phone), '+7 (###) ### ## ##', undefined),
      iin: Parse.string(json.iin),
      password: Parse.string(json.password),
      password_confirmation: Parse.string(json.password_confirmation),
    });
  };
}
