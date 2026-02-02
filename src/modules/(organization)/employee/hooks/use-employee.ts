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
    onSuccess: (_, deletedID) => {
      console.log('Delete employee response: ', deletedID)

      queryClient.setQueryData(
        [EmployeeQueryKey.GET_EMPLOYEES],
        (oldData: any) => {
          console.log('Old employee data: ', oldData)

          if (!oldData) return []

          if (Array.isArray(oldData)) {
            return oldData.filter((emp) => String(emp.id) !== String(deletedID))
          }

          const updatedData = { ...oldData }
          const keyToDelete = Object.keys(updatedData).find(
            (key) => String(updatedData[key].id) === String(deletedID),
          )

          if (keyToDelete) {
            delete updatedData[keyToDelete]
          }

          return updatedData
        },
      )

      toast.success('Employee deleted successfully')
    },
    onError: (error) => {
      console.error('Error deleting employee:', error)
      toast.error('Failed to delete employee')
    },
  })
}
