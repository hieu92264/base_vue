<script setup lang="ts">
import type { IEmployee } from '@/common/types/entities'
import DataTable from '@/components/DataTable.vue'
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog.vue'
import { Button } from '@/components/ui/button'
import EmployeeModal from '@/modules/(organization)/employee/components/EmployeeModal.vue'
import { getColumns } from '@/modules/(organization)/employee/data/columns'
import {
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetEmployeesQuery,
  useGetUserOptionsQuery,
  useUpdateEmployeeMutation,
} from '@/modules/(organization)/employee/hooks/use-employee'
import { Plus } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { EmployeeFormValues } from './-schemas/employee.schema'

const { t } = useI18n()
const { data, isLoading, isFetching, refetch } = useGetEmployeesQuery()

const isConfirmDelete = ref(false)
const selectedEmployee = ref<IEmployee | null>(null)
const isOpenModal = ref(false)

const { mutate: createEmployee, isPending: isCreating } =
  useCreateEmployeeMutation()
const { mutate: updateEmployee, isPending: isUpdating } =
  useUpdateEmployeeMutation()
const { mutate: deleteEmployee, isPending: isDeletingEmployee } =
  useDeleteEmployeeMutation()

const { data: userOptionsResponse } = useGetUserOptionsQuery(1)

const columns = computed(() => getColumns())

const userOptions = computed(() => userOptionsResponse.value || [])

const employeeData = computed(() => {
  if (!data.value) return []
  return Object.values(data.value) as IEmployee[]
})

const openCreateModal = () => {
  isOpenModal.value = true
  selectedEmployee.value = null
}

const openEditModal = (row: IEmployee) => {
  selectedEmployee.value = { ...row }
  isOpenModal.value = true
}

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

const handleSubmitEmployee = (data: EmployeeFormValues) => {
  const onSuccess = () => {
    isOpenModal.value = false
    selectedEmployee.value = null
  }
  if (selectedEmployee.value) {
    updateEmployee(
      {
        employeeId: selectedEmployee.value.id,
        employeeData: data,
      },
      { onSuccess },
    )
  } else {
    createEmployee(data, { onSuccess })
  }
}
</script>

<template>
  <div class="w-full overflow-auto px-4 py-2">
    <DataTable
      :columns="columns"
      :data="employeeData"
      :loading="isLoading || isFetching"
      :refetch-data="refetch"
      :is-fetching="isFetching || isDeletingEmployee"
      show-toolbar
      :update-row="openEditModal"
      :delete-row="openDeleteDialog"
    >
      <template #toolbar_right>
        <Button
          size="sm"
          class="h-9 gap-1 px-3"
          :disabled="isFetching"
          @click="openCreateModal"
        >
          <Plus class="h-4 w-4" />
          {{ t('pages.organizationEmployees.addEmployee') }}
        </Button>
      </template>
    </DataTable>

    <EmployeeModal
      :open="isOpenModal"
      @update:open="
        (v) => {
          isOpenModal = v
          if (!v) selectedEmployee = null
        }
      "
      :is-pending="isCreating || isUpdating"
      :initial-data="selectedEmployee"
      :handle-submit="handleSubmitEmployee"
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
