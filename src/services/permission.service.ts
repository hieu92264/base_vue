import type { IPermission } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import type { PermissionFormValues } from '@/modules/(organization)/permission/-schemas/permission.schema'

export class PermissionService {
  static async getPermissions(): Promise<ResponseBody<IPermission>> {
    const response = await axiosInstance.get('/organizations/permissions')
    console.log('Permissions response:', response)
    return response.data
  }

  static async deletePermission(permissionId: number): Promise<any> {
    const response = await axiosInstance.delete(
      `/organizations/permissions/${permissionId}`,
    )
  }

  static async createPermission(
    permissionData: PermissionFormValues,
  ): Promise<ResponseBody<IPermission>> {
    const response = await axiosInstance.post(
      '/organizations/permissions/create',
      permissionData,
    )
    return response.data
  }

  static async updatePermission(
    permissionId: number,
    permissionData: PermissionFormValues,
  ): Promise<ResponseBody<IPermission>> {
    const response = await axiosInstance.patch(
      `/organizations/permissions/update/${permissionId}`,
      permissionData,
    )
    return response.data
  }

  static async getPermissionOptions(): Promise<
    ResponseBody<{ label: string; value: number }>
  > {
    const response = await axiosInstance.get(
      '/organizations/permissions/options',
    )
    return response.data
  }
}
