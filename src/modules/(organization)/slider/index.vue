<script setup lang="ts">
import DataTable from '@/components/DataTable.vue'
import { computed, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog.vue'

import type { ISlider } from '@/common/types/entities'
import { columns } from './data/columns'
import SliderModal from './components/SliderModal.vue'
import type { SliderFormValues } from './-schemas/slider.schema'
import {
  useCreateSliderMutation,
  useDeleteSliderMutation,
  useGetSlidersQuery,
  useUpdateSliderMutation,
} from './hooks/use-slider'

const { data, isLoading, isFetching, refetch } = useGetSlidersQuery()

const isConfirmDelete = ref(false)
const selectedSlider = ref<ISlider | null>(null)
const isOpenModal = ref(false)

const { mutate: createSlider, isPending: isCreating } =
  useCreateSliderMutation()
const { mutate: updateSlider, isPending: isUpdating } =
  useUpdateSliderMutation()
const { mutate: deleteSlider, isPending: isDeleting } =
  useDeleteSliderMutation()

const sliderData = computed(() => {
  return data.value?.data ?? []
})

const openCreateModal = () => {
  isOpenModal.value = true
  selectedSlider.value = null
}

const openEditModal = (row: ISlider) => {
  selectedSlider.value = { ...row }
  isOpenModal.value = true
}

const openDeleteDialog = (row: ISlider) => {
  selectedSlider.value = row
  isConfirmDelete.value = true
}

const handleConfirmDelete = () => {
  if (!selectedSlider.value) return

  deleteSlider(selectedSlider.value.id, {
    onSuccess: () => {
      isConfirmDelete.value = false
      selectedSlider.value = null
    },
  })
}

const handleSubmitSlider = (payload: SliderFormValues) => {
  const onSuccess = () => {
    isOpenModal.value = false
    selectedSlider.value = null
  }

  if (selectedSlider.value) {
    updateSlider(
      {
        sliderId: selectedSlider.value.id,
        sliderData: payload,
      },
      { onSuccess },
    )
  } else {
    createSlider(payload, { onSuccess })
  }
}
</script>

<template>
  <div class="w-full overflow-auto px-4 py-2">
    <DataTable
      :columns="columns"
      :data="sliderData"
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
          Add Slider
        </Button>
      </template>
    </DataTable>

    <SliderModal
      :open="isOpenModal"
      @update:open="
        (v) => {
          isOpenModal = v
          if (!v) selectedSlider = null
        }
      "
      :is-pending="isCreating || isUpdating"
      :initial-data="selectedSlider"
      :handle-submit="handleSubmitSlider"
    />

    <DeleteConfirmDialog
      v-model:is-open-confirm="isConfirmDelete"
      v-on:confirm-delete="handleConfirmDelete"
    />
  </div>
</template>
