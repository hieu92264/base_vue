import i18n from '@/configs/i18n.config'
import type { PermissionFormValues } from '@/modules/(organization)/permission/-schemas/permission.schema'
import { PermissionService } from '@/services/permission.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

export enum PermissionQueryKey {
  GET_PERMISSIONS = 'get_permissions',
  GET_PERMISSION_OPTIONS = 'get_permission_options',
}

const t = (key: string) => (i18n.global as any).t(key) as string

export const useGetPermissionsQuery = () => {
  return useQuery({
    queryKey: [PermissionQueryKey.GET_PERMISSIONS],
    queryFn: PermissionService.getPermissions,
  })
}

export const useGetPermissionOptionsQuery = () => {
  return useQuery({
    queryKey: [PermissionQueryKey.GET_PERMISSION_OPTIONS],
    queryFn: PermissionService.getPermissionOptions,
  })
}

export const useCreatePermissionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: PermissionService.createPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PermissionQueryKey.GET_PERMISSIONS],
      })
      toast.success(t('pages.organizationPermissions.messages.createSuccess'))
    },
    onError: (error) => {
      console.error('Error creating permission:', error)
      toast.error(t('pages.organizationPermissions.messages.createError'))
    },
  })
}

export const useUpdatePermissionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      permissionId,
      permissionData,
    }: {
      permissionId: number
      permissionData: PermissionFormValues
    }) => PermissionService.updatePermission(permissionId, permissionData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PermissionQueryKey.GET_PERMISSIONS],
      })
      toast.success(t('pages.organizationPermissions.messages.updateSuccess'))
    },
    onError: (error) => {
      console.error('Error updating permission:', error)
      toast.error(t('pages.organizationPermissions.messages.updateError'))
    },
  })
}

export const useDeletePermissionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: PermissionService.deletePermission,
    onSuccess: (_, deletedID) => {
      queryClient.setQueryData(
        [PermissionQueryKey.GET_PERMISSIONS],
        (oldData: any) => {
          if (!oldData) return []
          if (Array.isArray(oldData)) {
            return oldData.filter((permission) => {
              return String(permission.id) !== String(deletedID)
            })
          }
          const updated = { ...oldData }
          const keyToDelete = Object.keys(updated).find(
            (key) => String(updated[key].id) === String(deletedID),
          )
          if (keyToDelete) delete updated[keyToDelete]
          return updated
        },
      )
      toast.success(t('pages.organizationPermissions.messages.deleteSuccess'))
    },
    onError: (error) => {
      console.error('Error deleting permission:', error)
      toast.error(t('pages.organizationPermissions.messages.deleteError'))
    },
  })
}
