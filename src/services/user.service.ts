import type { IPermissionUser, IUser } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import type { UserFormValues } from '@/modules/(organization)/user/-schemas/user.schema'

export class UserService {
  static async getUsers(): Promise<ResponseBody<IUser>> {
    const res = await axiosInstance.get('/organizations/users')
    return res.data
  }

  static async createUser(
    payload: UserFormValues,
  ): Promise<ResponseBody<IUser>> {
    const res = await axiosInstance.post('/organizations/users/create', payload)
    return res.data
  }

  static async updateUser(
    id: number,
    payload: UserFormValues,
  ): Promise<ResponseBody<IUser>> {
    const res = await axiosInstance.patch(
      `/organizations/users/update/${id}`,
      payload,
    )
    return res.data
  }

  static async deleteUser(id: number): Promise<any> {
    await axiosInstance.delete(`/organizations/users/delete/${id}`)
  }

  static async getUserPermissions(userId: number): Promise<
    ResponseBody<{
      user_id: number
      permission_ids: number[]
      permissions: IPermissionUser[]
    }>
  > {
    const res = await axiosInstance.get(
      `/organizations/users/${userId}/permissions`,
    )
    return res.data
  }

  static async syncUserPermissions(
    userId: number,
    permission_ids: number[],
  ): Promise<
    ResponseBody<{
      user_id: number
      permission_ids: number[]
    }>
  > {
    const res = await axiosInstance.put(
      `/organizations/users/${userId}/permissions`,
      { permission_ids },
    )

    return res.data
  }
}
