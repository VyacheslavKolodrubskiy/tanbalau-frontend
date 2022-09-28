import type { ShallowReactive } from 'vue';

export interface UsePaginationFields {
  total?: number
  perPage?: number
  page?: number
  lastPage?: number
}

export interface UsePaginationReturn {
  pagination: ShallowReactive<UsePaginationFields>
}

export function usePagination(options: UsePaginationFields = {}): UsePaginationReturn {
  const {
    total = 0,
    perPage = 20,
    page = 1,
    lastPage = 1,
  } = options;

  const pagination = shallowReactive({
    perPage,
    page,
    total,
    lastPage,
  });

  return {
    pagination,
  };
}
