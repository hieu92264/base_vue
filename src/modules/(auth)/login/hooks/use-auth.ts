import { AuthService } from '@/services'
import { useAuthStore } from '@/stores/auth.store'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

export enum AuthQueryKeys {}

type TQueryKey = readonly [typeof AuthQueryKeys, ...any[]]

export type TLoginData = {
  username: string
  password: string
}

export const useDoLoginMutation = () => {
  const router = useRouter()
  const authStore = useAuthStore()

  return useMutation({
    mutationFn: async (data: TLoginData) => {
      return AuthService.login(data)
    },

    onSuccess: (response) => {
      // const { access_token, refresh_token } = response
      console.log('Login response:', response)
      // authStore.setTokens(access_token ?? '', refresh_token ?? '')
      toast.success('Login successfully!')
      // router.push('/')
    },

    onError: (error: any) => {
      console.error('Login error:', error)
      toast.error(error?.response?.data?.message || 'Login failed')
    },
  })
}
