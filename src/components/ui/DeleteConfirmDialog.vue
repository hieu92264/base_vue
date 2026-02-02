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
        <AlertDialogTitle>Confirm delete row?</AlertDialogTitle>

        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the
          employee data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="handleCancel">Cancel </AlertDialogCancel>
        <AlertDialogAction @click="onConfirmDelete">Confirm</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
