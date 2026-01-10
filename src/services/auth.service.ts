import type { IUser } from '@/common/types/entities'
import { AppConfigs } from '@/configs/app.config'
import axiosInstance from '@/configs/axios.config'
import type { LoginFormValue } from '@/modules/(auth)/login/-schemas/login.schema'
import type { IAuthData, IAuthState } from '@/stores/auth.store'
import axios from 'axios'

export class AuthService {
  static async login(
    data: LoginFormValue,
  ): Promise<
    ResponseBody<Pick<IAuthState, 'user' | 'access_token' | 'refresh_token'>>
  > {
    return await axiosInstance.post('/auth/login', data)
  }

  static async getToken(refresh_token: string) {
    const response = await axios.post(
      `${AppConfigs.BASE_API_URL}/auth/refresh`,
      {
        refresh_token,
      },
    )
    return response.data
  }

  static async getCredentials(): Promise<ResponseBody<IAuthData>> {
    return await axiosInstance.get('/auth/me')
  }

  static logout() {}
}
