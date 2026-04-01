<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const props = defineProps<{
  isOpenConfirm: boolean
  onConfirmDelete: () => void
}>()

const emit = defineEmits(['update:isOpenConfirm'])

const handleCancel = () => {
  // Emit event to close the dialog
  emit('update:isOpenConfirm', false)
}
</script>

<template>
  <AlertDialog
    :open="isOpenConfirm"
    @update:open="$emit('update:isOpenConfirm', $event)"
  >
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Xác nhận xóa dòng này?</AlertDialogTitle>

        <AlertDialogDescription>
          Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn khỏi hệ
          thống.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="handleCancel">Hủy</AlertDialogCancel>
        <AlertDialogAction @click="onConfirmDelete">Xác nhận</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
