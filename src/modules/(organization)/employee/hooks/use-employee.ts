import { EmployeeService } from '@/services/employee.service'
import { useQuery } from '@tanstack/vue-query'

export enum EmployeeQueryKey {
  GET_EMPLOYEES = 'get_employees',
}

export const useGetEmployeesQuery = () => {
  return useQuery({
    queryKey: [EmployeeQueryKey.GET_EMPLOYEES],
    queryFn: EmployeeService.getEmployees,
  })
}
