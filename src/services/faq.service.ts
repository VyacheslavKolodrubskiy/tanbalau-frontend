import { Faq } from './../models/faq.models';
import { http } from '@/network/http';
import type { PaginationFilter, RequestParamValue } from '@/types';
import { HttpMethod } from '@/types';
import { ResponseParser } from '@/network/response-parser';
import { OperationResult } from '@/network/operation-result';
import type { Pagination } from '@/network/pagination.response';

export interface FaqFilters extends PaginationFilter {
  question?: string
}

export class FaqService {
  static async fetchPolls(params?: FaqFilters): Promise<OperationResult<Pagination<Faq>>> {
    try {
      const response = await http.request<Faq>({
        method: HttpMethod.GET,
        url: 'polls',
        params,
      });
      return ResponseParser.parsePaginationList(response, Faq.fromJson);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async createPoll(poll: Faq): Promise<OperationResult<any>> {
    try {
      const response = await http.request({
        method: HttpMethod.POST,
        url: 'polls',
        data: poll.toJson(),
      });
      message.success('Сохранено');

      return ResponseParser.parse(response);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async readPoll(id: RequestParamValue): Promise<OperationResult<Faq>> {
    try {
      const response = await http.request({
        method: HttpMethod.GET,
        url: `polls/${id}`,
      });

      return ResponseParser.parse(response, Faq.fromJson);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async updatePoll(id: RequestParamValue, poll: Faq): Promise<OperationResult<any>> {
    try {
      const response = await http.request({
        method: HttpMethod.PUT,
        url: `polls/${id}`,
        data: poll.toJson(),
      });
      message.success('Сохранено');

      return ResponseParser.parse(response);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async deletePoll(id: RequestParamValue): Promise<OperationResult<any>> {
    try {
      const response = await http.request({
        method: HttpMethod.DELETE,
        url: `polls/${id}`,
      });
      message.success('Удалено');

      return ResponseParser.parse(response);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }
}
