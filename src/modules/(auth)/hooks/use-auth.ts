import { Language } from '@/common/constants/enums'
import i18n from '@/configs/i18n.config'
import type { ForgotPasswordFormValue } from '@/modules/(auth)/forgot-password/-schemas/forgot-password.schema'
import type { RegisterFormValue } from '@/modules/(auth)/register/-schemas/register.schema'
import type { ResetPasswordFormValue } from '@/modules/(auth)/reset-password/-schemas/reset-password.schema'
import { AuthService } from '@/services'
import { useAuthStore } from '@/stores/auth.store'
import { useI18nStore } from '@/stores/i18n.store'
import { useUserStore } from '@/stores/user.store'
import { useMutation } from '@tanstack/vue-query'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

export enum AuthQueryKeys {}

export type TLoginData = {
  username: string
  password: string
}

const translate = (key: string) => (i18n.global as any).t(key) as string

export const useDoRegisterMutation = () => {
  const router = useRouter()
  const route = useRoute()

  return useMutation({
    mutationFn: async (data: RegisterFormValue) => {
      return await AuthService.register(data)
    },
    onSuccess: () => {
      toast.success(translate('auth.messages.registerSuccess'))
      router.replace({
        name: 'auth.login',
        query: route.query.redirect
          ? { redirect: String(route.query.redirect) }
          : undefined,
      })
    },
    onError: (error: any) => {
      console.error('Register error:', error)
      toast.error(error?.message || translate('auth.messages.registerError'))
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

        toast.success(translate('auth.messages.loginSuccess'))

        const redirectPath = route.query.redirect as string
        router.replace(redirectPath || { name: 'dashboard' })
      } else {
        authStore.clearSession()
        userStore.clearProfile()
        toast.error(translate('auth.messages.profileFetchError'))
      }
    },

    onError: (error: any) => {
      authStore.clearSession()
      userStore.clearProfile()
      console.error('Login error:', error)
      toast.error(
        error?.response?.data?.message || translate('auth.messages.loginError'),
      )
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

    onSuccess: async () => {
      authStore.clearSession()
      userStore.clearProfile()
      toast.success(translate('auth.messages.logoutSuccess'))
      router.replace({ name: 'auth.login' })
    },

    onError: (error: any) => {
      console.error('Logout error:', error)
      toast.error(
        error?.response?.data?.message || translate('auth.messages.logoutError'),
      )
    },
  })
}

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (payload: ForgotPasswordFormValue) =>
      AuthService.forgotPassword(payload.email),
    onSuccess: () => {
      toast.success(translate('auth.messages.forgotPasswordSuccess'))
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || translate('auth.messages.actionFailed'),
      )
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
      toast.success(translate('auth.messages.resetPasswordSuccess'))
      router.replace({ name: 'auth.login' })
    },

    onError: (error: any) => {
      console.error('Reset password error:', error)
      toast.error(
        error?.response?.data?.message ||
          translate('auth.messages.resetPasswordError'),
      )
    },
  })
}
