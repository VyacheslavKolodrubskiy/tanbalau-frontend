import { mask } from 'maska';
import type { JsonParser } from '@/types';
import { Parse } from '@/network/parse';
import type { IStatus, ISubscriptionStatus } from '@/models/status.model';
import { Status, SubscriptionStatus } from '@/models/status.model';
import type { IOrganization } from '@/models/organization.model';
import { Organization } from '@/models/organization.model';
import type { ILogs } from '@/models/logs.model';
import { Logs } from '@/models/logs.model';

export interface IClient {
  id?: number
  name?: string
  email?: string
  phone?: string
  note?: string
  isActive?: boolean
  counterpartyUser?: IOrganization
  iin?: string
  logs?: ILogs[]
  status?: IStatus
  subscription?: ISubscriptionStatus
}

// Hack for combine destructuring with parameter properties
// https://github.com/microsoft/TypeScript/issues/5326
export interface Client extends IClient {}

export class Client {
  constructor(props: IClient) {
    Object.assign(this, props);
  }

  static fromJson: JsonParser<Client> = (json) => {
    return new Client({
      id: Parse.number(json.id),
      name: Parse.string(json.name),
      counterpartyUser: Parse.object(json.counterpartyUser, Organization.fromJson),
      email: Parse.string(json.email),
      phone: mask(Parse.string(json.phone), '+7 (###) ### ## ##', undefined),
      note: Parse.string(json.note),
      isActive: Parse.boolean(json.is_active),
      iin: Parse.string(json.iin),
      status: Parse.object(json.status, Status.fromJson),
      logs: Parse.objectList(json.logs, Logs.fromJson),
      subscription: Parse.object(json.subscription, SubscriptionStatus.fromJson),
    });
  };
}
