import { PermissionService } from '@/services/permission.service'
import { useQuery } from '@tanstack/vue-query'

export enum PermissionQueryKey {
  GET_PERMISSIONS = 'get_permissions',
}

export const useGetPermissionsQuery = () => {
  return useQuery({
    queryKey: [PermissionQueryKey.GET_PERMISSIONS],
    queryFn: PermissionService.getPermissions,
  })
}
