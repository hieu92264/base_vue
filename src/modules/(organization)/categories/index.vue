<script setup lang="ts">
import type { ICategory } from '@/common/types/entities'
import DataTable from '@/components/DataTable.vue'
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog.vue'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { CategoryFormValues } from './-schemas/category.schema'
import CategoryModal from './components/CategoryModal.vue'
import { getColumns } from './data/columns'
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from './hooks/use-category'

const { t } = useI18n()
const { data, isLoading, isFetching, refetch } = useGetCategoriesQuery()

const isConfirmDelete = ref(false)
const selectedCategory = ref<ICategory | null>(null)
const isOpenModal = ref(false)

const { mutate: createCategory, isPending: isCreating } =
  useCreateCategoryMutation()
const { mutate: updateCategory, isPending: isUpdating } =
  useUpdateCategoryMutation()
const { mutate: deleteCategory, isPending: isDeleting } =
  useDeleteCategoryMutation()

const columns = computed(() => getColumns())

const categoryData = computed(() => {
  if (!data.value) return []
  return Object.values(data.value) as ICategory[]
})

const openCreateModal = () => {
  isOpenModal.value = true
  selectedCategory.value = null
}

const openEditModal = (row: ICategory) => {
  selectedCategory.value = { ...row }
  isOpenModal.value = true
}

const openDeleteDialog = (row: ICategory) => {
  selectedCategory.value = row
  isConfirmDelete.value = true
}

const handleConfirmDelete = () => {
  if (selectedCategory.value) {
    deleteCategory(selectedCategory.value.id, {
      onSuccess: () => {
        isConfirmDelete.value = false
        selectedCategory.value = null
      },
    })
  }
}

const handleSubmitCategory = (payload: CategoryFormValues) => {
  const onSuccess = () => {
    isOpenModal.value = false
    selectedCategory.value = null
  }

  if (selectedCategory.value) {
    updateCategory(
      { categoryId: selectedCategory.value.id, categoryData: payload },
      { onSuccess },
    )
  } else {
    createCategory(payload, { onSuccess })
  }
}
</script>

<template>
  <div class="w-full px-4 py-2 overflow-auto">
    <DataTable
      :columns="columns"
      :data="categoryData"
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
          {{ t('pages.organizationCategories.addCategory') }}
        </Button>
      </template>
    </DataTable>

    <CategoryModal
      :open="isOpenModal"
      @update:open="
        (v) => {
          isOpenModal = v
          if (!v) selectedCategory = null
        }
      "
      :is-pending="isCreating || isUpdating"
      :initial-data="selectedCategory"
      :handle-submit="handleSubmitCategory"
    />

    <DeleteConfirmDialog
      v-model:is-open-confirm="isConfirmDelete"
      v-on:confirm-delete="handleConfirmDelete"
    />
  </div>
</template>
