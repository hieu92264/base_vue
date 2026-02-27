<script setup lang="ts">
import { WorkStatus } from '@/common/constants/enums'
import type { IEmployee } from '@/common/types/entities'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { watch } from 'vue'
import DatePicker from '@/components/DatePicker.vue'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useForm } from 'vee-validate'
import { formSchema } from '@/modules/(organization)/employee/-schemas/employee.schema'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'

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

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    user_id: undefined,
    full_name: '',
    status: WorkStatus.OFFICIAL,
    email: '',
    join_date: '',
    dob: '',
    phone: '',
    terminate_date: '',
    remark: '',
  },
})

const workStatusOptions = Object.entries(WorkStatus).map(([key, value]) => {
  return {
    text: key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' '),
    value: value,
  }
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted with values:', values)
})

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.setValues({
        user_id: newData.user_id ? String(newData.user_id) : undefined,

        full_name: newData.full_name ?? '',
        status: newData.status ?? WorkStatus.OFFICIAL,
        email: newData.email ?? '',
        join_date: newData.join_date ?? '',
        dob: newData.dob ?? '',
        phone: newData.phone ?? '',
        terminate_date: newData.terminate_date ?? '',
        remark: newData.remark ?? '',
      })
    } else {
      form.resetForm()
    }
  },
  { immediate: true },
)
</script>

<template>
  <Dialog
    :open="false"
    @update:open="$emit('update:open', $event)"
  >
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {{ initialData ? 'Edit Employee' : 'Add New Employee' }}
        </DialogTitle>

        <DialogDescription>
          Fill in employee information, then click Submit to save.
        </DialogDescription>
      </DialogHeader>

      <form
        class="space-y-6"
        @submit="onSubmit"
      >
        <div class="grid gap-4">
          <FormField
            v-slot="{ componentField }"
            name="user_id"
          >
            <!-- user account -->
            <FormItem>
              <FormLabel>User Account</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
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
              </FormControl>
            </FormItem>
          </FormField>

          <!-- full name and work status -->
          <div class="grid grid-cols-2 gap-4">
            <FormField
              v-slot="{ componentField }"
              name="full_name"
            >
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    v-bind="componentField"
                    placeholder="Enter full name"
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="status"
            >
              <FormItem>
                <FormLabel>Work Status</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
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
                </FormControl>
              </FormItem>
            </FormField>
          </div>

          <!-- email -->
          <div class="grid grid-cols-1 gap-4">
            <FormField
              v-slot="{ componentField }"
              name="email"
            >
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    type="email"
                    placeholder="Enter email"
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>

          <!-- join_date and dob -->
          <div class="grid grid-cols-2 gap-4">
            <FormField
              v-slot="{ componentField }"
              name="join_date"
            >
              <FormItem>
                <FormLabel>Join Date</FormLabel>
                <FormControl>
                  <DatePicker
                    v-bind="componentField"
                    placeholder="Pick join date"
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="dob"
            >
              <FormItem>
                <FormLabel>Date Of Birth</FormLabel>
                <FormControl>
                  <DatePicker
                    v-bind="componentField"
                    placeholder="Pick date of birth"
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>

          <!-- phone and terminate date -->
          <div class="grid grid-cols-2 gap-4">
            <FormField
              v-slot="{ componentField }"
              name="phone"
            >
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="Enter phone number"
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="terminate_date"
            >
              <FormItem>
                <FormLabel>Terminate Date</FormLabel>
                <FormControl>
                  <DatePicker
                    v-bind="componentField"
                    placeholder="Pick terminate date"
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <FormField
              v-slot="{ componentField }"
              name="remark"
            >
              <FormItem>
                <FormLabel>Remark</FormLabel>
                <FormControl>
                  <Textarea
                    v-bind="componentField"
                    placeholder="Enter remark"
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>
        </div>

        <DialogFooter class="mt-4!">
          <DialogClose as-child>
            <Button
              type="button"
              variant="outline"
              >Cancel</Button
            >
          </DialogClose>
          <Button
            type="submit"
            :disabled="isPending"
          >
            {{ isPending ? 'Saving...' : 'Submit' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
