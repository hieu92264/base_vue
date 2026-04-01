<script setup lang="ts">
import { WorkStatus } from '@/common/constants/enums'
import type { IEmployee } from '@/common/types/entities'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { computed, ref, watch } from 'vue'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useForm } from 'vee-validate'
import {
  employeeFormSchema,
  type EmployeeFormValues,
} from '@/modules/(organization)/employee/-schemas/employee.schema'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { toTypedSchema } from '@vee-validate/zod'

// export type EmployeeFormValues = Pick<
//   IEmployee,
//   | 'user_id'
//   | 'full_name'
//   | 'status'
//   | 'join_date'
//   | 'email'
//   | 'dob'
//   | 'phone'
//   | 'terminate_date'
//   | 'remark'
// >

const props = defineProps<{
  open: boolean
  isPending: boolean
  initialData?: IEmployee | null
  userOptions?: Array<{ text: string; value: number; selected?: boolean }>
  handleSubmit: (data: EmployeeFormValues) => void
}>()

const userSearch = ref('')

const filteredUserOptions = computed(() => {
  const q = userSearch.value.trim().toLowerCase()
  if (!q) return props.userOptions ?? []

  return (props.userOptions ?? []).filter((o) =>
    o.text.toLowerCase().includes(q),
  )
})

watch(
  () => props.userOptions,
  (newVal) => {
    console.log('Dữ liệu userOptions mới nhận được:', newVal)
  },
  { immediate: true },
)

const emit = defineEmits(['update:open', 'submit'])

const form = useForm({
  validationSchema: toTypedSchema(employeeFormSchema),
  initialValues: {
    id: undefined,
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

const toDateInputValue = (v?: string | null) => {
  if (!v) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v

  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return ''

  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const onSubmit = form.handleSubmit((values) => {
  props.handleSubmit(values)
})

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.setValues({
        id: newData.id,
        user_id: newData.user_id ? String(newData.user_id) : undefined,
        full_name: newData.full_name ?? '',
        status: newData.status ?? WorkStatus.OFFICIAL,
        email: newData.email ?? '',
        join_date: toDateInputValue(newData.join_date) ?? '',
        dob: toDateInputValue(newData.dob) ?? '',
        phone: newData.phone ?? '',
        terminate_date: toDateInputValue(newData.terminate_date) ?? '',
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
    :open="open"
    @update:open="$emit('update:open', $event)"
  >
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {{ initialData ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới' }}
        </DialogTitle>

        <DialogDescription>
          Điền thông tin nhân viên rồi bấm Lưu để hoàn tất.
        </DialogDescription>
      </DialogHeader>

      <form
        class="space-y-6"
        @submit.prevent="onSubmit"
      >
        <div class="grid gap-4">
          <FormField
            v-slot="{ componentField }"
            name="user_id"
          >
            <FormItem>
              <FormLabel>Tài khoản người dùng</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Chọn người dùng" />
                  </SelectTrigger>

                  <SelectContent class="max-h-60 overflow-y-auto">
                    <!-- Search box -->
                    <div class="sticky top-0 z-10 bg-background p-2">
                      <Input
                        v-model="userSearch"
                        placeholder="Tìm người dùng..."
                        @keydown.stop
                      />
                    </div>

                    <SelectItem
                      v-for="option in filteredUserOptions"
                      :key="option.value"
                      :value="option.value.toString()"
                    >
                      {{ option.text }}
                    </SelectItem>

                    <div
                      v-if="filteredUserOptions.length === 0"
                      class="px-3 py-2 text-sm text-muted-foreground"
                    >
                      Không có kết quả
                    </div>
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
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    v-bind="componentField"
                    placeholder="Nhập họ và tên"
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="status"
            >
              <FormItem>
                <FormLabel>Trạng thái làm việc</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Chọn trạng thái làm việc" />
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
                    placeholder="Nhập email"
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
                <FormLabel>Ngày vào làm</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    type="date"
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="dob"
            >
              <FormItem>
                <FormLabel>Ngày sinh</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    type="date"
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
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="Nhập số điện thoại"
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="terminate_date"
            >
              <FormItem>
                <FormLabel>Ngày nghỉ việc</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    type="date"
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
                <FormLabel>Ghi chú</FormLabel>
                <FormControl>
                  <Textarea
                    v-bind="componentField"
                    placeholder="Nhập ghi chú"
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>
        </div>

        <DialogFooter class="mt-4!">
          <Button
            type="button"
            variant="outline"
            @click="$emit('update:open', false)"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            :disabled="isPending"
          >
            {{ isPending ? 'Đang lưu...' : 'Lưu' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
