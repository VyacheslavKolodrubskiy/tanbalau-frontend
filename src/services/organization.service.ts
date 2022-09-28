import { http } from '@/network/http';
import { User } from '@/models/user.model';
import { Organization } from '@/models/organization.model';
import { ResponseParser } from '@/network/response-parser';
import type { Pagination } from '@/network/pagination.response';
import { OperationResult } from '@/network/operation-result';
import type { PaginationFilter, RequestParamValue } from '@/types';
import { HttpMethod } from '@/types';

export interface OrganizationFilter extends PaginationFilter {
  id?: string
  bin?: string
  title?: string
  phone?: string
  email?: string
  legal_address?: string
}

export class OrganizationService {
  static async fetchOrganization(params?: OrganizationFilter): Promise<OperationResult<Pagination<Organization>>> {
    try {
      const response = await http.request<Organization>({
        method: HttpMethod.GET,
        url: 'counterparties',
        params,
      });
      return ResponseParser.parsePaginationList(response, Organization.fromJson);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async readOrgUser(params: { bin: RequestParamValue }): Promise<OperationResult<User>> {
    try {
      const response = await http.request<User>({
        method: HttpMethod.GET,
        url: 'counterparties/customer/get-user-data',
        params,
      });

      message.success('Организация успешно подтверждена.');

      return ResponseParser.parse(response, User.fromJson);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async registerOrganization(org: Organization): Promise<OperationResult<any>> {
    try {
      const response = await http.request({
        method: HttpMethod.POST,
        url: 'counterparties/customer/register',
        data: org.toJson(),
      });
      message.success('Организация успешно подтверждена');

      return ResponseParser.parse(response);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async readOrganization(id: RequestParamValue): Promise<OperationResult<Organization>> {
    try {
      const response = await http.request({
        method: HttpMethod.GET,
        url: `counterparties/${id}`,
      });

      return ResponseParser.parse(response, Organization.fromJson);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async validateBinEmail(org: Organization): Promise<OperationResult<any>> {
    try {
      const response = await http.request({
        method: HttpMethod.POST,
        url: 'counterparties/customer/check',
        data: {
          title: org.title,
          bin: org.bin,
          email: org.email,
          phone: org.phone,
          legal_address: org.legalAddress,
        },
      });

      return ResponseParser.parse(response);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async assignOrgUser(orgUser: { counterparty_id: RequestParamValue }): Promise<OperationResult<any>> {
    try {
      const response = await http.request({
        method: HttpMethod.POST,
        url: `counterparties/customer/assign-new-user/${orgUser.counterparty_id}`,
        data: orgUser,
      });
      message.success('Ваши данные сохранены. Указанная организация теперь будет доступна в Вашем личном кабинете');

      return ResponseParser.parse(response);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async updateOrganization(id: RequestParamValue, org: Organization): Promise<OperationResult<any>> {
    try {
      const response = await http.request({
        method: HttpMethod.PUT,
        url: `counterparties/${id}`,
        data: org.toJson(),
      });
      message.success('Сохранено');

      return ResponseParser.parse(response);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }
}
