import i18n from '@/configs/i18n.config'
import { UserService } from '@/services/user.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import type { UserFormValues } from '../-schemas/user.schema'

export enum UserQueryKey {
  GET_USERS = 'get_users',
}

const t = (key: string) => (i18n.global as any).t(key) as string

export const useGetUsersQuery = () =>
  useQuery({
    queryKey: [UserQueryKey.GET_USERS],
    queryFn: UserService.getUsers,
  })

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: UserService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UserQueryKey.GET_USERS] })
      toast.success(t('pages.organizationUsers.messages.createSuccess'))
    },
    onError: (error) => {
      console.error(error)
      toast.error(t('pages.organizationUsers.messages.createError'))
    },
  })
}

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserFormValues }) =>
      UserService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UserQueryKey.GET_USERS] })
      toast.success(t('pages.organizationUsers.messages.updateSuccess'))
    },
    onError: (error) => {
      console.error(error)
      toast.error(t('pages.organizationUsers.messages.updateError'))
    },
  })
}

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: UserService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UserQueryKey.GET_USERS] })
      toast.success(t('pages.organizationUsers.messages.deleteSuccess'))
    },
    onError: (error) => {
      console.error(error)
      toast.error(t('pages.organizationUsers.messages.deleteError'))
    },
  })
}
