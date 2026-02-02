import type { IEmployee } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class EmployeeService {
  static async getEmployees(): Promise<ResponseBody<IEmployee>> {
    const response = await axiosInstance.get('/organizations/employees')
    console.log('Employees response:', response)
    return response.data
  }

  static async deleteEmployee(employeeId: number): Promise<any> {
    const response = await axiosInstance.delete(
      `organizations/employees/delete/${employeeId}`,
    )

    console.log('Delete employee response:', response)
  }

  static async getUserOptions(userId?: number): Promise<
    ResponseBody<{
      label: string
      value: number
      selected?: boolean
    }>
  > {
    const response = await axiosInstance.get(
      '/organizations/employees/user-options',
      {
        params: {
          user_id: userId,
        },
      },
    )
    console.log('User options response:', response)
    return response.data
  }
}
