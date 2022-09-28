import type { IAuth } from '@/models/auth.model';
import { http } from '@/network/http';
import type { RequestParamValue } from '@/types';
import { HttpMethod } from '@/types';
import { ResponseParser } from '@/network/response-parser';
import { OperationResult } from '@/network/operation-result';

export class AuthService {
  static async register(registerForm: IAuth): Promise<OperationResult<any>> {
    try {
      const response = await http.request({
        method: HttpMethod.POST,
        url: 'auth/register',
        data: registerForm,
      });

      message.success('Ваши данные сохранены. На указанную почту придет письмо подтверждения.');

      return ResponseParser.parse(response);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async login(formData: { email: RequestParamValue; password: RequestParamValue }): Promise<OperationResult<any>> {
    try {
      const response = await http.request({
        method: HttpMethod.POST,
        url: 'auth/login',
        data: formData,
      });

      return ResponseParser.parse(response);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async sendConfirmation(formData: { email: RequestParamValue }): Promise<OperationResult<any>> {
    try {
      const response = await http.request({
        method: HttpMethod.POST,
        url: 'auth/send-confirmation',
        data: formData,
      });
      message.success('Ваши данные сохранены. На указанную почту придет письмо подтверждения.');

      return ResponseParser.parse(response);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async changePassword(formData: { token: RequestParamValue; password: RequestParamValue; password_confirmation: RequestParamValue }): Promise<OperationResult<any>> {
    try {
      const response = await http.request({
        method: HttpMethod.POST,
        url: `auth/recovery/change-password/${formData.token}`,
        data: formData,
      });
      message.success('Вы успешно сменили пароль.');

      return ResponseParser.parse(response);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async activateProfile(params: { token: RequestParamValue }): Promise<OperationResult<any>> {
    try {
      const response = await http.request({
        method: HttpMethod.GET,
        url: `auth/confirm/${params.token}`,
        params,
      });
      message.success('Аккаунт успешно подтверждён.');

      return ResponseParser.parse(response);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async recoverByIin(formData: { iin: RequestParamValue }): Promise<OperationResult<any>> {
    try {
      await http.request({
        method: HttpMethod.POST,
        url: 'auth/recovery/check-iin',
        data: formData,
      });

      const response = await http.request({
        method: HttpMethod.POST,
        url: 'auth/recovery/recover-by-iin',
        data: formData,
      });

      message.success(response.data.data);

      return ResponseParser.parse(response);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }

  static async recoverByEmail(formData: { email: RequestParamValue }): Promise<OperationResult<any>> {
    try {
      await http.request({
        method: HttpMethod.POST,
        url: 'auth/recovery/check-email',
        data: formData,
      });

      const recoveryResponse = await http.request({
        method: HttpMethod.POST,
        url: 'auth/recovery/recover-by-email',
        data: formData,
      });

      message.success('Письмо с новым паролем отправлено на Вашу почту');

      return ResponseParser.parse(recoveryResponse);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }
}
