import type { JsonParser } from '@/types';
import { Parse } from '@/network/parse';

export interface IStatus {
  id: number
  title: string
}

// Hack for combine destructuring with parameter properties
// https://github.com/microsoft/TypeScript/issues/5326
export interface Status extends IStatus {}

export class Status {
  constructor(props: IStatus) {
    Object.assign(this, props);
  }

  static fromJson: JsonParser<Status> = (json) => {
    return new Status({
      id: Parse.number(json.id),
      title: Parse.string(json.title),
    });
  };
}

export interface ISubscriptionStatus extends IStatus {
  expiredAt: any // todo
  transferApplication?: boolean
  transferInfo?: number
}

export interface SubscriptionStatus extends ISubscriptionStatus {}

export class SubscriptionStatus extends Status {
  constructor(props: ISubscriptionStatus) {
    super(props);
    this.expiredAt = props.expiredAt;
    this.transferApplication = props.transferApplication;
    this.transferInfo = props.transferInfo;
  }

  static fromJson: JsonParser<SubscriptionStatus> = (json) => {
    return new SubscriptionStatus({
      id: Parse.number(json.id),
      title: Parse.string(json.title),
      expiredAt: Parse.date(json.expired_at),
      transferApplication: Parse.boolean(json.transfer_application),
      transferInfo: Parse.number(json.transfer_info?.user?.id),
    });
  };
}
