import type { IPermission } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class PermissionService {
  static async getPermissions(): Promise<ResponseBody<IPermission>> {
    const response = await axiosInstance.get('/organizations/permissions')
    console.log('Permissions response:', response)
    return response.data
  }
}
