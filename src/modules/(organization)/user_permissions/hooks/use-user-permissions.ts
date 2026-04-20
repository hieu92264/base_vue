import i18n from '@/configs/i18n.config'
import { UserService } from '@/services/user.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import { toast } from 'vue-sonner'

export enum UserPermissionQueryKey {
  GET_USER_PERMISSIONS = 'get_user_permissions',
}

const t = (key: string) => (i18n.global as any).t(key) as string

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

    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          UserPermissionQueryKey.GET_USER_PERMISSIONS,
          variables.userId,
        ],
      })
      toast.success(
        t('pages.organizationUserPermissions.messages.updateSuccess'),
        {
          duration: 3000,
        },
      )
    },

    onError: (error: any) => {
      console.error('Failed to sync user permissions:', error)
      const message = error?.message
      toast.error(
        message
          ? `${t('pages.organizationUserPermissions.messages.updateError')}: ${message}`
          : t('pages.organizationUserPermissions.messages.updateError'),
        {
          duration: 3000,
        },
      )
    },
  })
}
