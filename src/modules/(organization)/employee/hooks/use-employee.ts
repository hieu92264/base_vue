import i18n from '@/configs/i18n.config'
import { EmployeeService } from '@/services/employee.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import type { EmployeeFormValues } from '../-schemas/employee.schema'

export enum EmployeeQueryKey {
  GET_EMPLOYEES = 'get_employees',
  GET_USER_OPTIONS = 'get_user_options',
}

const t = (key: string) => (i18n.global as any).t(key) as string

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
      queryClient.setQueryData(
        [EmployeeQueryKey.GET_EMPLOYEES],
        (oldData: any) => {
          if (!oldData) return []

          if (Array.isArray(oldData)) {
            return oldData.filter((employee) => {
              return String(employee.id) !== String(deletedID)
            })
          }

          const updatedData = { ...oldData }
          const keyToDelete = Object.keys(updatedData).find(
            (key) => String(updatedData[key].id) === String(deletedID),
          )

          if (keyToDelete) delete updatedData[keyToDelete]

          return updatedData
        },
      )

      toast.success(t('pages.organizationEmployees.messages.deleteSuccess'))
    },
    onError: (error) => {
      console.error('Error deleting employee:', error)
      toast.error(t('pages.organizationEmployees.messages.deleteError'))
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EmployeeQueryKey.GET_EMPLOYEES],
      })
      toast.success(t('pages.organizationEmployees.messages.createSuccess'))
    },
    onError: (error) => {
      console.error('Error creating employee:', error)
      toast.error(t('pages.organizationEmployees.messages.createError'))
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EmployeeQueryKey.GET_EMPLOYEES],
      })
      toast.success(t('pages.organizationEmployees.messages.updateSuccess'))
    },
    onError: (error) => {
      console.error('Error updating employee:', error)
      toast.error(t('pages.organizationEmployees.messages.updateError'))
    },
  })
}
