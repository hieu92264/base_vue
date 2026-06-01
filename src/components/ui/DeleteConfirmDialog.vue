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
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  isOpenConfirm: boolean
  onConfirmDelete: () => void
}>()

const emit = defineEmits(['update:isOpenConfirm'])
const { t } = useI18n()

const handleCancel = () => {
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
        <AlertDialogTitle>{{ t('table.deleteDialog.title') }}</AlertDialogTitle>

        <AlertDialogDescription>
          {{ t('table.deleteDialog.description') }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="handleCancel">{{ t('common.cancel') }}</AlertDialogCancel>
        <AlertDialogAction @click="onConfirmDelete">{{ t('common.confirm') }}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
