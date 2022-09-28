import { Client } from '@/models/client.model';
import { http } from '@/network/http';
import type { PaginationFilter, RequestParamValue } from '@/types';
import { HttpMethod } from '@/types';
import { ResponseParser } from '@/network/response-parser';
import { OperationResult } from '@/network/operation-result';
import type { Pagination } from '@/network/pagination.response';

export interface ClientFilters extends PaginationFilter{
  name?: string
  company?: string
  iin?: string
  email?: string
  active?: string
  subStatus?: string[]
  transfer_application?: number
}

export class ClientService {
  static async fetchClients(params?: ClientFilters): Promise<OperationResult<Pagination<Client>>> {
    try {
      const response = await http.request<Client>({
        method: HttpMethod.GET,
        url: 'users/customer',
        params,
      });
      return ResponseParser.parsePaginationList(response, Client.fromJson);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async transferTariff(customerId: RequestParamValue): Promise<OperationResult<any>> {
    try {
      const response = await http.request({
        method: HttpMethod.GET,
        url: `/users/customer/transfer-subscription/${customerId}`,
      });

      return ResponseParser.parse(response);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async readClient(id: RequestParamValue): Promise<OperationResult<Client>> {
    try {
      const response = await http.request({
        method: HttpMethod.GET,
        url: `users/customer/${id}`,
      });

      return ResponseParser.parse(response, Client.fromJson);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }
}
