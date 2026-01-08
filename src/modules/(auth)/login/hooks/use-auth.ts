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
      console.log('Login response:', response)
      toast.success('Login successfully!')
      router.push('/')
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Login failed')
    },
  })
}
