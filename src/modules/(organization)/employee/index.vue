<script setup lang="ts">
import DataTable from '@/components/DataTable.vue'
import {
  useDeleteEmployeeMutation,
  useGetEmployeesQuery,
  useGetUserOptionsQuery,
} from '@/modules/(organization)/employee/hooks/use-employee'
import { computed, ref } from 'vue'
import type { IEmployee } from '@/common/types/entities'
import { columns } from '@/modules/(organization)/employee/data/columns'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog.vue'
import EmployeeModal from '@/modules/(organization)/employee/components/EmployeeModal.vue'

const { data, error, isLoading, isFetching, refetch } = useGetEmployeesQuery()
const isConfirmDelete = ref(false)
const selectedEmployee = ref<IEmployee | null>(null)

const { data: userOptionsResponse } = useGetUserOptionsQuery(1)

const userOptions = computed(() => {
  console.log(
    'userOptionsResponse',
    Object.values(userOptionsResponse.value ?? {}),
  )
  return userOptionsResponse.value || []
})
const { mutate: deleteEmployee, isPending: isDeletingEmployee } =
  useDeleteEmployeeMutation()

const employeeData = computed(() => {
  if (!data.value) return []
  const newData = Object.values(data.value) as IEmployee[]
  return newData
})

const openDeleteDialog = (row: IEmployee) => {
  selectedEmployee.value = row
  isConfirmDelete.value = true
}

const handleConfirmDelete = () => {
  if (selectedEmployee.value) {
    deleteEmployee(selectedEmployee.value.id, {
      onSuccess: () => {
        isConfirmDelete.value = false
        selectedEmployee.value = null
      },
    })
  }
}
</script>

<template>
  <div class="w-full px-4 py-2 overflow-auto">
    <DataTable
      :columns="columns"
      :data="employeeData"
      :loading="isLoading || isFetching"
      :refetch-data="refetch"
      :is-fetching="isFetching || isDeletingEmployee"
      show-toolbar
      :delete-row="openDeleteDialog"
    >
      <template #toolbar_right>
        <Button
          size="sm"
          class="h-9 gap-1 px-3"
          :disabled="isFetching"
        >
          <Plus class="w-4 h-4" />
          Add Employee
        </Button>
      </template>
    </DataTable>

    <EmployeeModal
      :open="false"
      :is-pending="false"
      :initial-data="null"
      :handle-submit="() => {}"
      :user-options="
        userOptions as Array<{
          text: string
          value: number
          selected?: boolean
        }>
      "
    />

    <DeleteConfirmDialog
      v-model:is-open-confirm="isConfirmDelete"
      v-on:confirm-delete="handleConfirmDelete"
    />
  </div>
</template>
