import type { IEmployee } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import type { EmployeeFormValues } from '@/modules/(organization)/employee/-schemas/employee.schema'

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

  static async createEmployee(employeeData: EmployeeFormValues): Promise<any> {
    const response = await axiosInstance.post(
      `/organizations/employees/create`,
      employeeData,
    )

    console.log('Create employee response:', response)
    return response.data
  }

  static async updateEmployee(
    employeeId: number,
    employeeData: EmployeeFormValues,
  ): Promise<any> {
    const response = await axiosInstance.patch(
      `/organizations/employees/update/${employeeId}`,
      employeeData,
    )
  }
}
