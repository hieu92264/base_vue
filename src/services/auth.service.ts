import type { IUser } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import type { LoginFormValue } from '@/modules/(auth)/login/-schemas/login.schema'
import type { IAuthState } from '@/stores/auth.store'

export class AuthService {
  static async login(
    data: LoginFormValue,
  ): Promise<ResponseBody<Pick<IAuthState, 'user' | 'token'>>> {
    return await axiosInstance.post('/auth/login', data)
  }

  static getAccessToken(): string {
    return 'test'
  }

  static async getCredentials(): Promise<ResponseBody<IUser>> {
    const response = await axiosInstance.get('/auth/me')
    return response.data
  }

  static logout() {}
}
