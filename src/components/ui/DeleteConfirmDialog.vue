<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const props = defineProps<{
  isOpenConfirm: boolean
  onConfirmDelete: () => void
}>()
</script>

<template>
  <AlertDialog
    :open="isOpenConfirm"
    @update:open="$emit('update:isOpenConfirm', $event)"
  >
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirm delete row?</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="$emit('update:isOpenConfirm', false)"
          >Cancel</AlertDialogCancel
        >
        <AlertDialogAction @click="onConfirmDelete">Confirm</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
