import { mask } from 'maska';
import type { JsonParser, SerializedData } from '@/types';
import { Parse } from '@/network/parse';

export interface IAdmin {
  id?: number
  name?: string
  email?: string
  phone?: string
  note?: string
  password?: string
}

// Hack for combine destructuring with parameter properties
// https://github.com/microsoft/TypeScript/issues/5326
export interface Admin extends IAdmin {}

export class Admin {
  constructor(props: IAdmin) {
    Object.assign(this, props);
  }

  static fromJson: JsonParser<Admin> = (json) => {
    return new Admin({
      id: Parse.number(json.id),
      name: Parse.string(json.name),
      email: Parse.string(json.email),
      phone: mask(Parse.string(json.phone), '+7 (###) ### ## ##', undefined),
      note: Parse.string(json.note),
    });
  };

  toJson(): SerializedData {
    return {
      email: this.email,
      name: this.name,
      note: this.note,
      password: this.password,
      phone: this.phone,
    };
  }
}
