import { Notification } from '@/models/notification.model';
import { http } from '@/network/http';
import type { RequestParamValue } from '@/types';
import { HttpMethod } from '@/types';
import { ResponseParser } from '@/network/response-parser';
import { OperationResult } from '@/network/operation-result';

export class NotificationService {
  static async checkUnreadNotifications(): Promise<OperationResult<Notification[]>> {
    try {
      const response = await http.request({
        method: HttpMethod.GET,
        url: 'notifications',
      });

      return ResponseParser.parseList(response, Notification.fromJson);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async transferTariff(): Promise<OperationResult<any>> {
    try {
      const response = await http.request({
        method: HttpMethod.GET,
        url: 'profile/transfer-subscription',
      });

      return ResponseParser.parse(response);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async readNotification(id: RequestParamValue): Promise<OperationResult<any>> {
    try {
      const response = await http.request({
        method: HttpMethod.GET,
        url: `notifications/read/${id}`,
      });

      return ResponseParser.parse(response);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }
}
