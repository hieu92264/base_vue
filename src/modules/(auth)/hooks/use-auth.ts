import { Language } from '@/common/constants/enums'
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

        toast.success('Login successfully!')

        const redirectPath = route.query.redirect as string
        router.replace(redirectPath || { name: 'dashboard' })
      } else {
        authStore.clearSession()
        userStore.clearProfile()
        toast.error('Cannot get user profile')
      }
    },

    onError: (error: any) => {
      authStore.clearSession()
      userStore.clearProfile()
      console.error('Login error:', error)
      toast.error(error?.response?.data?.message || 'Login failed')
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
      toast.success('Logout successfully!')
      router.replace({ name: 'auth.login' })
    },

    onError: (error: any) => {
      console.error('Logout error:', error)
      toast.error(error?.response?.data?.message || 'Logout failed')
    },
  })
}
