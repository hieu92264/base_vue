import { EmployeeService } from '@/services/employee.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import type { EmployeeFormValues } from '../-schemas/employee.schema'

export enum EmployeeQueryKey {
  GET_EMPLOYEES = 'get_employees',
  GET_USER_OPTIONS = 'get_user_options',
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

      toast.success('Xóa nhân viên thành công')
    },
    onError: (error) => {
      console.error('Error deleting employee:', error)
      toast.error('Xóa nhân viên thất bại')
    },
  })
}

export const useGetUserOptionsQuery = (userId?: number) => {
  return useQuery({
    queryKey: [EmployeeQueryKey.GET_USER_OPTIONS],
    queryFn: () => EmployeeService.getUserOptions(userId),
  })
}

export const useCreateEmployeeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: EmployeeService.createEmployee,
    onSuccess: (res) => {
      console.log('Create employee response: ', res)
      queryClient.invalidateQueries({
        queryKey: [EmployeeQueryKey.GET_EMPLOYEES],
      })
      toast.success('Tạo nhân viên thành công')
    },
    onError: (error) => {
      console.error('Error creating employee:', error)
      toast.error('Tạo nhân viên thất bại')
    },
  })
}

export const useUpdateEmployeeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      employeeId,
      employeeData,
    }: {
      employeeId: number
      employeeData: EmployeeFormValues
    }) => EmployeeService.updateEmployee(employeeId, employeeData),
    onSuccess: (res) => {
      console.log('Update employee response: ', res)
      queryClient.invalidateQueries({
        queryKey: [EmployeeQueryKey.GET_EMPLOYEES],
      })
      toast.success('Cập nhật nhân viên thành công')
    },
    onError: (error) => {
      console.error('Error updating employee:', error)
      toast.error('Cập nhật nhân viên thất bại')
    },
  })
}
