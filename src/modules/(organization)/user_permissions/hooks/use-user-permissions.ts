import { UserService } from '@/services/user.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import { toast } from 'vue-sonner'

export enum UserPermissionQueryKey {
  GET_USER_PERMISSIONS = 'get_user_permissions',
}

export const useGetUserPermissionsQuery = (userId: Ref<number>) => {
  return useQuery({
    queryKey: computed(() => [
      UserPermissionQueryKey.GET_USER_PERMISSIONS,
      userId.value,
    ]),
    queryFn: () => UserService.getUserPermissions(userId.value),
    enabled: computed(() => !!userId.value),
  })
}

export const useSyncUserPermissionsMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { userId: number; permission_ids: number[] }) =>
      UserService.syncUserPermissions(payload.userId, payload.permission_ids),

    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          UserPermissionQueryKey.GET_USER_PERMISSIONS,
          variables.userId,
        ],
      })
      toast.success('Cập nhật quyền người dùng thành công', { duration: 3000 })
    },

    onError: (err: any) => {
      console.error('Cập nhật quyền người dùng thất bại:', err)
      toast.error(
        'Cập nhật quyền người dùng thất bại: ' +
          (err?.message ?? 'Lỗi không xác định'),
        {
          duration: 3000,
        },
      )
    },
  })
}
