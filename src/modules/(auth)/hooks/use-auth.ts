import { Language } from '@/common/constants/enums'
import type { ForgotPasswordFormValue } from '@/modules/(auth)/forgot-password/-schemas/forgot-password.schema'
import type { RegisterFormValue } from '@/modules/(auth)/register/-schemas/register.schema'
import type { ResetPasswordFormValue } from '@/modules/(auth)/reset-password/-schemas/reset-password.schema'
import { AuthService } from '@/services'
import { useAuthStore } from '@/stores/auth.store'
import { useI18nStore } from '@/stores/i18n.store'
import { useUserStore } from '@/stores/user.store'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

export enum AuthQueryKeys {}

type TQueryKey = readonly [typeof AuthQueryKeys, ...any[]]

export type TLoginData = {
  username: string
  password: string
}

export const useDoRegisterMutation = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: RegisterFormValue) => {
      return AuthService.register(data)
    },
    onSuccess: async (response) => {
      toast.success(
        'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
      )
      router.replace({ name: 'auth.login' })
    },
    onError: (error: any) => {
      console.error('Register error:', error)
      toast.error(error?.response?.data?.message || 'Đăng ký thất bại')
    },
  })
}

export const useDoLoginMutation = () => {
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()
  const userStore = useUserStore()
  const i18nStore = useI18nStore()

  return useMutation({
    mutationFn: async (data: TLoginData) => {
      return AuthService.login(data)
    },

    onSuccess: async (response) => {
      const authData = response.data
      if (authData) {
        authStore.saveSession(
          authData.access_token ?? '',
          authData.refresh_token ?? '',
        )
      }

      const profileRes = await AuthService.getCredentials()

      if (profileRes && profileRes.data) {
        userStore.setProfile(profileRes.data)

        i18nStore.setLocale(
          (profileRes.data.user?.locale || Language.ENGLISH) as Language,
        )

        console.log('locale: ', i18nStore.locale)

        toast.success('Đăng nhập thành công!')

        const redirectPath = route.query.redirect as string
        router.replace(redirectPath || { name: 'dashboard' })
      } else {
        authStore.clearSession()
        userStore.clearProfile()
        toast.error('Không thể lấy thông tin người dùng')
      }
    },

    onError: (error: any) => {
      authStore.clearSession()
      userStore.clearProfile()
      console.error('Login error:', error)
      toast.error(error?.response?.data?.message || 'Đăng nhập thất bại')
    },
  })
}

export const useDoLogoutMutation = () => {
  const router = useRouter()
  const authStore = useAuthStore()
  const userStore = useUserStore()

  return useMutation({
    mutationFn: async () => {
      return AuthService.logout()
    },

    onSuccess: async (response) => {
      authStore.clearSession()
      userStore.clearProfile()
      toast.success('Đăng xuất thành công!')
      router.replace({ name: 'auth.login' })
    },

    onError: (error: any) => {
      console.error('Logout error:', error)
      toast.error(error?.response?.data?.message || 'Đăng xuất thất bại')
    },
  })
}

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (payload: ForgotPasswordFormValue) =>
      AuthService.forgotPassword(payload.email),
    onSuccess: () => {
      toast.success(
        'Nếu email tồn tại, chúng tôi đã gửi liên kết đặt lại mật khẩu.',
      )
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Thao tác thất bại')
    },
  })
}

export const useResetPasswordMutation = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: ResetPasswordFormValue) => {
      return AuthService.resetPassword(payload)
    },

    onSuccess: () => {
      toast.success(
        'Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.',
      )
      router.replace({ name: 'auth.login' })
    },

    onError: (error: any) => {
      console.error('Reset password error:', error)
      toast.error(error?.response?.data?.message || 'Đặt lại mật khẩu thất bại')
    },
  })
}
