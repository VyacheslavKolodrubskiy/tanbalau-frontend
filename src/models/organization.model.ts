import { mask } from 'maska';
import type { JsonParser, SerializedData } from '@/types';
import { Parse } from '@/network/parse';

export interface IOrganization {
  id?: number
  bin?: string
  email?: string
  omsId?: string
  phone?: string
  title?: string
  apiKey?: string
  clientToken?: string
  legalAddress?: string
}

// Hack for combine destructuring with parameter properties
// https://github.com/microsoft/TypeScript/issues/5326
export interface Organization extends IOrganization {}

export class Organization {
  constructor(props: IOrganization) {
    Object.assign(this, props);
  }

  static fromJson: JsonParser<Organization> = (json) => {
    return new Organization({
      id: Parse.number(json.id),
      bin: Parse.string(json.bin),
      email: Parse.string(json.email),
      title: Parse.string(json.title),
      omsId: Parse.string(json.oms_id),
      apiKey: Parse.string(json.api_key),
      clientToken: Parse.string(json.client_token),
      legalAddress: Parse.string(json.legal_address),
      phone: mask(Parse.string(json.phone), '+7 (###) ### ## ##', undefined),
    });
  };

  toJson(): SerializedData {
    return {
      bin: this.bin,
      email: this.email,
      phone: this.phone,
      title: this.title,
      oms_id: this.omsId,
      api_key: this.apiKey,
      client_token: this.clientToken,
      legal_address: this.legalAddress,
    };
  }
}
