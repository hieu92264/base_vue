<script setup lang="ts">
import type { IUser } from '@/common/types/entities'
import DataTable from '@/components/DataTable.vue'
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog.vue'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { UserFormValues } from './-schemas/user.schema'
import UserModal from './components/UserModal.vue'
import { getColumns } from './data/columns'
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from './hooks/use-user'

const { t } = useI18n()
const { data, isLoading, isFetching, refetch } = useGetUsersQuery()

const isConfirmDelete = ref(false)
const selectedUser = ref<IUser | null>(null)
const isOpenModal = ref(false)

const { mutate: createUser, isPending: isCreating } = useCreateUserMutation()
const { mutate: updateUser, isPending: isUpdating } = useUpdateUserMutation()
const { mutate: deleteUser, isPending: isDeleting } = useDeleteUserMutation()

const columns = computed(() => getColumns())

const userData = computed(() => {
  if (!data.value) return []
  return Object.values(data.value) as IUser[]
})

const openCreateModal = () => {
  isOpenModal.value = true
  selectedUser.value = null
}

const openEditModal = (row: IUser) => {
  selectedUser.value = { ...row }
  isOpenModal.value = true
}

const openDeleteDialog = (row: IUser) => {
  selectedUser.value = row
  isConfirmDelete.value = true
}

const handleConfirmDelete = () => {
  if (!selectedUser.value) return
  deleteUser(selectedUser.value.id, {
    onSuccess: () => {
      isConfirmDelete.value = false
      selectedUser.value = null
    },
  })
}

const handleSubmitUser = (payload: UserFormValues) => {
  const onSuccess = () => {
    isOpenModal.value = false
    selectedUser.value = null
  }

  if (selectedUser.value) {
    updateUser({ id: selectedUser.value.id, data: payload }, { onSuccess })
  } else {
    createUser(payload, { onSuccess })
  }
}
</script>

<template>
  <div class="w-full overflow-auto px-4 py-2">
    <DataTable
      :columns="columns"
      :data="userData"
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
          {{ t('pages.organizationUsers.addUser') }}
        </Button>
      </template>
    </DataTable>

    <UserModal
      :open="isOpenModal"
      @update:open="
        (v) => {
          isOpenModal = v
          if (!v) selectedUser = null
        }
      "
      :is-pending="isCreating || isUpdating"
      :initial-data="selectedUser"
      :handle-submit="handleSubmitUser"
    />

    <DeleteConfirmDialog
      v-model:is-open-confirm="isConfirmDelete"
      v-on:confirm-delete="handleConfirmDelete"
    />
  </div>
</template>
