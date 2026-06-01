import type { IUser } from '@/common/types/entities'
import { AppConfigs } from '@/configs/app.config'
import axiosInstance from '@/configs/axios.config'
import type { LoginFormValue } from '@/modules/(auth)/login/-schemas/login.schema'
import type { RegisterFormValue } from '@/modules/(auth)/register/-schemas/register.schema'
import { useAuthStore, type IAuthState } from '@/stores/auth.store'
import type { IUserStore } from '@/stores/user.store'
import axios from 'axios'

export class AuthService {
  static async login(
    data: LoginFormValue,
  ): Promise<ResponseBody<Pick<IAuthState, 'access_token' | 'refresh_token'>>> {
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

  static async getCredentials(): Promise<ResponseBody<IUserStore>> {
    return await axiosInstance.get('/auth/me')
  }

  static async logout(): Promise<ResponseBody<any>> {
    const authStore = useAuthStore()
    return await axiosInstance.post('/auth/logout', {
      refresh_token: authStore.refresh_token,
    })
  }

  static async register(data: RegisterFormValue): Promise<ResponseBody<any>> {
    return await axiosInstance.post('/auth/register-account', data)
  }

  static async forgotPassword(email: string) {
    return await axiosInstance.post('/auth/forgot-password', { email })
  }

  static async resetPassword(payload: {
    token: string
    email: string
    password: string
    password_confirmation: string
  }) {
    return await axiosInstance.post('/auth/reset-password', payload)
  }
}
