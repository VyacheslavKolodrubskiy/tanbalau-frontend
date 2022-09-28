import { mask } from 'maska';
import type { JsonParser, SerializedData } from '@/types';
import { Parse } from '@/network/parse';
import type { ISubscriptionStatus } from '@/models/status.model';
import { SubscriptionStatus } from '@/models/status.model';
import type { IOrganization } from '@/models/organization.model';
import { Organization } from '@/models/organization.model';
import type { IRole } from '@/models/role.model';
import { Role } from '@/models/role.model';

export interface IUser {
  id?: number
  name?: string
  email?: string
  iin?: string
  phone?: string
  counterparty_id?: number
  counterparty?: IOrganization
  subscription?: ISubscriptionStatus
  role?: IRole
}

// Hack for combine destructuring with parameter properties
// https://github.com/microsoft/TypeScript/issues/5326
export interface User extends IUser {}

export class User {
  constructor(props: IUser) {
    Object.assign(this, props);
  }

  static fromJson: JsonParser<User> = (json) => {
    return new User({
      name: Parse.string(json.name),
      email: Parse.string(json.email),
      iin: Parse.string(json.iin),
      phone: mask(Parse.string(json.phone), '+7 (###) ### ## ##', undefined),
      counterparty_id: Parse.number(json.counterparty_id),
      counterparty: Parse.object(json.counterparty, Organization.fromJson),
      subscription: Parse.object(json.subscription, SubscriptionStatus.fromJson),
      role: Parse.object(json.role, Role.fromJson),
    });
  };

  toJson(): SerializedData {
    return {
      email: this.email,
      name: this.name,
      phone: this.phone,
      iin: this.iin,
      counterparty_id: this.counterparty_id,
    };
  }
}
