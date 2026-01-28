import type { IEmployee } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class EmployeeService {
  static async getEmployees(): Promise<ResponseBody<IEmployee>> {
    const response = await axiosInstance.get('/organizations/employees')
    console.log('Employees response:', response)
    return response.data
  }
}
