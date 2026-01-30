<script setup lang="ts">
import DataTable from '@/components/DataTable.vue'
import {
  useDeleteEmployeeMutation,
  useGetEmployeesQuery,
} from '@/modules/(organization)/employee/hooks/use-employee'
import { computed } from 'vue'
import type { IEmployee } from '@/common/types/entities'
import { columns } from '@/modules/(organization)/employee/data/columns'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'

const { data, error, isLoading, isFetching, refetch } = useGetEmployeesQuery()

const { mutate: deleteEmployee, isPending: isDeletingEmployee } =
  useDeleteEmployeeMutation()

const employeeData = computed(() => {
  console.log('Employee data error:', data.value)
  if (!data.value) return []
  const newData = Object.values(data.value) as IEmployee[]
  console.log('Employee data:', newData)
  return newData
})

const handleDeleteEmployee = async (row: IEmployee) => {
  console.log('Delete employee:', row)
  await deleteEmployee(row.id)
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
      :delete-row="handleDeleteEmployee"
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
  </div>
</template>
