import { Manager } from '@/models/manager.model';
import { http } from '@/network/http';
import type { PaginationFilter, RequestParamValue } from '@/types';
import { HttpMethod } from '@/types';
import { ResponseParser } from '@/network/response-parser';
import { OperationResult } from '@/network/operation-result';
import type { Pagination } from '@/network/pagination.response';

export interface ManagerFilters extends PaginationFilter{
  name: string
  branch: string
  active: string
  status: number | null
  email: string
}

export class ManagerService {
  static async fetchManager(params?: ManagerFilters): Promise<OperationResult<Pagination<Manager>>> {
    try {
      const response = await http.request<Manager>({
        method: HttpMethod.GET,
        url: 'users/manager',
        params,
      });
      return ResponseParser.parsePaginationList(response, Manager.fromJson);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async createManager(manager: Manager): Promise<OperationResult<any>> {
    try {
      const response = await http.request({
        method: HttpMethod.POST,
        url: 'users/manager',
        data: manager.toJson(),
      });
      message.success('Сохранено');

      return ResponseParser.parse(response);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async readManager(id: RequestParamValue): Promise<OperationResult<Manager>> {
    try {
      const response = await http.request({
        method: HttpMethod.GET,
        url: `users/manager/${id}`,
      });

      return ResponseParser.parse(response, Manager.fromJson);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async updateManager(id: RequestParamValue, manager: Manager): Promise<OperationResult<any>> {
    try {
      const response = await http.request({
        method: HttpMethod.PUT,
        url: `users/manager/${id}`,
        data: manager.toJson(),
      });
      message.success('Сохранено');

      return ResponseParser.parse(response);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }
}
