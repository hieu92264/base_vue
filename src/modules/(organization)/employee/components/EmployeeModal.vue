<script setup lang="ts">
import { WorkStatus } from '@/common/constants/enums'
import type { IEmployee } from '@/common/types/entities'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CalendarRangeIcon } from 'lucide-vue-next'
import { ref, toRef, watch } from 'vue'
import { DateFormatter, getLocalTimeZone, today } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'
import { Calendar } from '@/components/ui/calendar'
import { useDateSync } from '@/common/utils/useDateSync'
import DatePicker from '@/components/DatePicker.vue'

export type EmployeeFormValues = Pick<
  IEmployee,
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
  userOptions?: Array<{ text: string; value: number; selected?: boolean }>
  handleSubmit: (data: EmployeeFormValues) => void
}>()

watch(
  () => props.userOptions,
  (newVal) => {
    console.log('Dữ liệu userOptions mới nhận được:', newVal)
  },
  { immediate: true },
)

const emit = defineEmits(['update:open', 'submit'])

const formData = ref<EmployeeFormValues>({
  user_id: null,
  full_name: '' as string,
  status: WorkStatus.OFFICIAL,
  join_date: '',
  email: '',
  dob: '',
  phone: '',
  terminate_date: '',
  remark: '',
})

const workStatusOptions = Object.entries(WorkStatus).map(([key, value]) => {
  return {
    text: key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' '),
    value: value,
  }
})
</script>

<template>
  <Dialog
    :open="open"
    @update:open="$emit('update:open', $event)"
  >
    <!-- <form></form> -->
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {{ initialData ? 'Edit Employee' : 'Add New Employee' }}
        </DialogTitle>
      </DialogHeader>

      <div class="grid gap-4">
        <!-- user account -->
        <div class="grid gap-4">
          <div class="grid gap-3">
            <Label for="user_id">User account</Label>
            <Select v-model="formData.user_id">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in userOptions"
                  :key="option.value"
                  :value="option.value.toString()"
                >
                  {{ option.text }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- full name and work status -->
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-3">
            <Label for="full_name">Full name</Label>
            <Input
              id="full_name"
              name="full_name"
              :model-value="formData.full_name || ''"
            />
          </div>

          <div class="grid gap-3">
            <Label for="status">Work status</Label>
            <Select v-model="formData.status">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a status work" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in workStatusOptions"
                  :key="option.value"
                  :value="option.value.toString()"
                >
                  {{ option.text }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- email -->
        <div class="grid gap-3">
          <Label for="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="text"
            :model-value="formData.email || ''"
          />
        </div>

        <!-- join_date and dob -->
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-3">
            <Label for="join_date">Join date</Label>
            <DatePicker
              :model-value="formData.join_date"
              placeholder="Pick a join date"
              name="join_date"
            />
          </div>

          <div class="grid gap-3">
            <Label for="dob">date of birth</Label>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
