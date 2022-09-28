import { User } from '@/models/user.model';
import { http } from '@/network/http';
import { HttpMethod } from '@/types';
import { ResponseParser } from '@/network/response-parser';
import { OperationResult } from '@/network/operation-result';

export class UserService {
  static async readUser(): Promise<OperationResult<User>> {
    try {
      const response = await http.request({
        method: HttpMethod.GET,
        url: 'profile',
      });

      return ResponseParser.parse(response, User.fromJson);
    } catch (error) {
      return OperationResult.fromError(error);
    }
  }
}
