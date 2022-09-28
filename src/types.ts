import type { RouteLocationRaw } from 'vue-router';
import type { Rule } from 'ant-design-vue/lib/form';

export type BaseObj = Record<string | number, any>;

export type ValidationRules = Record<string, Rule | Rule[]>;

export type JsonData = Record<string, any>;

export type SerializedData = Record<string, any>;

export type JsonParser<T> = (json: JsonData) => T;

export type RequestParamValue = string | number;

export type Removable<T> = T | null | undefined;

export type PermissionRole = 'admin' | 'manager' | 'client';

export type MarkRequired<T, R extends keyof T> = Partial<T> & Required<Pick<T, R>>;

export const enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

export interface PaginationFilter {
  page?: number
}

export interface TableAction<T = any> {
  to?: RouteLocationRaw | ((record: T) => RouteLocationRaw)
  click?: ((record: T) => void)
  title: string
  condition?: ((record: T) => boolean)
}

export type TableActions<T = any> = TableAction<T>[];
