<script setup lang="ts">
import type { IPermission } from '@/common/types/entities'
import DataTable from '@/components/DataTable.vue'
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog.vue'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PermissionFormValues } from './-schemas/permission.schema'
import PermissionModal from './components/PermissionModal.vue'
import { getColumns } from './data/columns'
import {
  useCreatePermissionMutation,
  useDeletePermissionMutation,
  useGetPermissionOptionsQuery,
  useGetPermissionsQuery,
  useUpdatePermissionMutation,
} from './hooks/use-permission'

const { t } = useI18n()
const { data, isLoading, isFetching, refetch } = useGetPermissionsQuery()

const isConfirmDelete = ref(false)
const selectedPermission = ref<IPermission | null>(null)
const isOpenModal = ref(false)

const { mutate: createPermission, isPending: isCreating } =
  useCreatePermissionMutation()
const { mutate: updatePermission, isPending: isUpdating } =
  useUpdatePermissionMutation()
const { mutate: deletePermission, isPending: isDeleting } =
  useDeletePermissionMutation()

const { data: permissionOptionsResponse } = useGetPermissionOptionsQuery()

const columns = computed(() => getColumns())

const permissionOptions = computed(() => {
  const raw = permissionOptionsResponse.value || []
  return (raw as any[]).map((x) => ({
    text: x.label ?? x.text ?? '',
    value: x.value,
    selected: x.selected,
  }))
})

const permissionData = computed(() => {
  if (!data.value) return []
  return Object.values(data.value) as IPermission[]
})

const openCreateModal = () => {
  isOpenModal.value = true
  selectedPermission.value = null
}

const openEditModal = (row: IPermission) => {
  selectedPermission.value = { ...row }
  isOpenModal.value = true
}

const openDeleteDialog = (row: IPermission) => {
  selectedPermission.value = row
  isConfirmDelete.value = true
}

const handleConfirmDelete = () => {
  if (selectedPermission.value) {
    deletePermission(selectedPermission.value.id, {
      onSuccess: () => {
        isConfirmDelete.value = false
        selectedPermission.value = null
      },
    })
  }
}

const handleSubmitPermission = (payload: PermissionFormValues) => {
  const onSuccess = () => {
    isOpenModal.value = false
    selectedPermission.value = null
  }

  if (selectedPermission.value) {
    updatePermission(
      { permissionId: selectedPermission.value.id, permissionData: payload },
      { onSuccess },
    )
  } else {
    createPermission(payload, { onSuccess })
  }
}
</script>

<template>
  <div class="w-full overflow-auto px-4 py-2">
    <DataTable
      :columns="columns"
      :data="permissionData"
      :loading="isLoading || isFetching"
      :refetch-data="refetch"
      :is-fetching="isFetching || isDeleting"
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
          {{ t('pages.organizationPermissions.addPermission') }}
        </Button>
      </template>
    </DataTable>

    <PermissionModal
      :open="isOpenModal"
      @update:open="
        (v) => {
          isOpenModal = v
          if (!v) selectedPermission = null
        }
      "
      :is-pending="isCreating || isUpdating"
      :initial-data="selectedPermission"
      :handle-submit="handleSubmitPermission"
      :permission-options="
        permissionOptions as Array<{
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
