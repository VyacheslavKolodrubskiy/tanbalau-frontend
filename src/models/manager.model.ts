import { mask } from 'maska';
import type { JsonParser, SerializedData } from '@/types';
import { Parse } from '@/network/parse';
import type { IStatus } from '@/models/status.model';
import { Status } from '@/models/status.model';

export interface IManager {
  id?: number
  name?: string
  email?: string
  phone?: string
  note?: string
  password?: string
  isActive?: boolean
  branchUser?: IStatus
  branchId?: number
  statusId?: number
  status?: IStatus
}

// Hack for combine destructuring with parameter properties
// https://github.com/microsoft/TypeScript/issues/5326
export interface Manager extends IManager {}

export class Manager {
  constructor(props: IManager) {
    Object.assign(this, props);
  }

  static fromJson: JsonParser<Manager> = (json) => {
    return new Manager({
      id: Parse.number(json.id),
      name: Parse.string(json.name),
      email: Parse.string(json.email),
      phone: mask(Parse.string(json.phone), '+7 (###) ### ## ##', undefined),
      note: Parse.string(json.note),
      isActive: Parse.boolean(json.is_active),
      branchId: Parse.number(json.branchUser?.id),
      branchUser: Parse.object(json.branchUser, Status.fromJson),
      statusId: Parse.number(json.status?.id),
      status: Parse.object(json.status, Status.fromJson),
    });
  };

  toJson(): SerializedData {
    return {
      email: this.email,
      name: this.name,
      note: this.note,
      password: this.password,
      phone: this.phone,
      branch_id: this.branchId,
      status_id: this.statusId,
    };
  }
}
