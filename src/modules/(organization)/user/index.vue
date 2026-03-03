<script setup lang="ts">
import DataTable from '@/components/DataTable.vue'
import { computed, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog.vue'
import type { IUser } from '@/common/types/entities'
import { columns } from './data/columns'
import UserModal from './components/UserModal.vue'
import type { UserFormValues } from './-schemas/user.schema'
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from './hooks/use-user'

const { data, isLoading, isFetching, refetch } = useGetUsersQuery()

const isConfirmDelete = ref(false)
const selectedUser = ref<IUser | null>(null)
const isOpenModal = ref(false)

const { mutate: createUser, isPending: isCreating } = useCreateUserMutation()
const { mutate: updateUser, isPending: isUpdating } = useUpdateUserMutation()
const { mutate: deleteUser, isPending: isDeleting } = useDeleteUserMutation()

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
  <div class="w-full px-4 py-2 overflow-auto">
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
          <Plus class="w-4 h-4" />
          Add User
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
