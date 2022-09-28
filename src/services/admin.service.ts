import { Admin } from '@/models/admin.model';
import { http } from '@/network/http';
import type { PaginationFilter, RequestParamValue } from '@/types';
import { HttpMethod } from '@/types';
import { ResponseParser } from '@/network/response-parser';
import { OperationResult } from '@/network/operation-result';
import type { Pagination } from '@/network/pagination.response';

export interface AdminFilter extends PaginationFilter {
  name?: string
  email?: string
}

export class AdminService {
  static async fetchAdmin(params?: AdminFilter): Promise<OperationResult<Pagination<Admin>>> {
    try {
      const response = await http.request<Admin>({
        method: HttpMethod.GET,
        url: 'users/admin',
        params,
      });
      return ResponseParser.parsePaginationList(response, Admin.fromJson);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async createAdmin(admin: Admin): Promise<OperationResult<any>> {
    try {
      const response = await http.request({
        method: HttpMethod.POST,
        url: 'users/admin',
        data: admin.toJson(),
      });
      message.success('Сохранено');

      return ResponseParser.parse(response);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async readAdmin(id: RequestParamValue): Promise<OperationResult<Admin>> {
    try {
      const response = await http.request({
        method: HttpMethod.GET,
        url: `users/admin/${id}`,
      });

      return ResponseParser.parse(response, Admin.fromJson);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async updateAdmin(id: RequestParamValue, admin: Admin): Promise<OperationResult<any>> {
    try {
      const response = await http.request({
        method: HttpMethod.PUT,
        url: `users/admin/${id}`,
        data: admin.toJson(),
      });
      message.success('Сохранено');

      return ResponseParser.parse(response);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }
}
