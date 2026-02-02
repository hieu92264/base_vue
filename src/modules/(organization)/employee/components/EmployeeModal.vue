<script setup lang="ts">
import { WorkStatus } from '@/common/constants/enums'
import type { IEmployee } from '@/common/types/entities'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ref } from 'vue'

export type EmployeeFormValues = Pick<
  IEmployee,
  | 'employee_code'
  | 'user_id'
  | 'full_name'
  | 'status'
  | 'join_date'
  | 'email'
  | 'dob'
  | 'phone'
  | 'terminate_date'
  | 'remark'
>

const props = defineProps<{
  open: boolean
  isPending: boolean
  initialData?: IEmployee | null
}>()

const emit = defineEmits(['update:open', 'submit'])

const formData = ref<EmployeeFormValues>({
  employee_code: '',
  user_id: null,
  full_name: '',
  status: WorkStatus.OFFICIAL,
  join_date: '',
  email: '',
  dob: '',
  phone: '',
  terminate_date: '',
  remark: '',
})
</script>

<template>
  <Dialog
    :open="open"
    @update:open="$emit('update:open', $event)"
  >
    <DialogContent class="min-w-xl">
      <DialogHeader>
        <DialogTitle>
          {{ initialData ? 'Edit Employee' : 'Add New Employee' }}
        </DialogTitle>
      </DialogHeader>
    </DialogContent>
  </Dialog>
</template>
