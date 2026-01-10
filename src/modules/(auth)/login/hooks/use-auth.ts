import { AuthService } from '@/services'
import { useAuthStore } from '@/stores/auth.store'
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

  return useMutation({
    mutationFn: async (data: TLoginData) => {
      return AuthService.login(data)
    },

    onSuccess: async (response) => {
      const authData = response.data
      if (authData) {
        authStore.setTokens(
          authData.access_token ?? '',
          authData.refresh_token ?? '',
        )
      }

      const profileRes = await AuthService.getCredentials()

      if (profileRes && profileRes.data) {
        authStore.setAuthData(profileRes.data)
        toast.success('Login successfully!')

        const redirectPath = route.query.redirect as string
        router.replace(redirectPath || { name: 'home' })
      } else {
        authStore.resetCredentials()
        toast.error('Cannot get user profile')
      }
    },

    onError: (error: any) => {
      authStore.resetCredentials()
      console.error('Login error:', error)
      toast.error(error?.response?.data?.message || 'Login failed')
    },
  })
}
