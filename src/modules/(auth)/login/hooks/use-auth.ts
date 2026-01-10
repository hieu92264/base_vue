import { AuthService } from '@/services'
import { useAuthStore } from '@/stores/auth.store'
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

        toast.success('Login successfully!')

        const redirectPath = route.query.redirect as string
        router.replace(redirectPath || { name: 'home' })
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
