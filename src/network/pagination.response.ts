import type { JsonData, JsonParser } from '@/types';
import { Parse } from '@/network/parse';

interface IPagination<T> {
  perPage?: number
  lastPage?: number
  total?: number
  list: T[]
}

export interface Pagination<T> extends IPagination<T> {}

export class Pagination<T> {
  constructor(props: IPagination<T>) {
    Object.assign(this, props);
  }

  static fromJson<T>(json: JsonData, itemParser: JsonParser<T>) {
    const content: T[] = json.data || [];

    const meta = json.meta || {};
    return new Pagination<T>({
      list: content.map(it => itemParser(it)),
      perPage: Parse.number(meta.per_page),
      lastPage: Parse.number(meta.last_page, { defaultValue: 1 }),
      total: Parse.number(meta.total, { defaultValue: 1 }),
    });
  }

  static getConverter<T>(itemParser: JsonParser<T>): JsonParser<Pagination<T>> {
    return (json: JsonData) => Pagination.fromJson(json, itemParser);
  }
}
