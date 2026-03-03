import { UserService } from '@/services/user.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import type { UserFormValues } from '../-schemas/user.schema'

export enum UserQueryKey {
  GET_USERS = 'get_users',
}

export const useGetUsersQuery = () =>
  useQuery({
    queryKey: [UserQueryKey.GET_USERS],
    queryFn: UserService.getUsers,
  })

export const useCreateUserMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: UserService.createUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [UserQueryKey.GET_USERS] })
      toast.success('User created successfully')
    },
    onError: (e) => {
      console.error(e)
      toast.error('Failed to create user')
    },
  })
}

export const useUpdateUserMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserFormValues }) =>
      UserService.updateUser(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [UserQueryKey.GET_USERS] })
      toast.success('User updated successfully')
    },
    onError: (e) => {
      console.error(e)
      toast.error('Failed to update user')
    },
  })
}

export const useDeleteUserMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: UserService.deleteUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [UserQueryKey.GET_USERS] })
      toast.success('User deleted successfully')
    },
    onError: (e) => {
      console.error(e)
      toast.error('Failed to delete user')
    },
  })
}
