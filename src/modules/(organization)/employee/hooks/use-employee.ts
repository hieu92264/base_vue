import { EmployeeService } from '@/services/employee.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

export enum EmployeeQueryKey {
  GET_EMPLOYEES = 'get_employees',
}

export const useGetEmployeesQuery = () => {
  return useQuery({
    queryKey: [EmployeeQueryKey.GET_EMPLOYEES],
    queryFn: EmployeeService.getEmployees,
  })
}

export const useDeleteEmployeeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: EmployeeService.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EmployeeQueryKey.GET_EMPLOYEES],
      })

      toast.success('Employee deleted successfully')
    },
    onError: (error) => {
      console.error('Error deleting employee:', error)
      toast.error('Failed to delete employee')
    },
  })
}
