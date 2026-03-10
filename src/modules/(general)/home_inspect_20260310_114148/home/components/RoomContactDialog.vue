<script setup lang="ts">
import { computed, watch } from 'vue'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'

export type ContactFormValues = {
  name: string
  phone: string
  email?: string
  moveInDate: string
  message?: string
}

const props = defineProps<{
  modelValue: boolean
  roomTitle?: string | null
  roomPrice?: number | string | null
  formatMoney?: (value: number | string) => string

  isPending?: boolean
  isError?: boolean

  onSubmit: (values: ContactFormValues) => void
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const moneyText = computed(() => {
  const price = props.roomPrice ?? 0
  return props.formatMoney
    ? props.formatMoney(price as any)
    : String(price ?? '')
})

// -------------------- Schema --------------------
const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Vui lòng nhập họ tên.')
    .max(100, 'Tối đa 100 ký tự.'),
  phone: z
    .string()
    .min(1, 'Vui lòng nhập số điện thoại.')
    .max(20, 'Tối đa 20 ký tự.'),
  email: z.string().email('Email không hợp lệ.').optional().or(z.literal('')),
  moveInDate: z.string().min(1, 'Vui lòng chọn ngày dự kiến dọn vào.'),
  message: z
    .string()
    .max(1000, 'Tối đa 1000 ký tự.')
    .optional()
    .or(z.literal('')),
})

type ContactSchemaValues = z.infer<typeof contactSchema>

const form = useForm<ContactSchemaValues>({
  validationSchema: toTypedSchema(contactSchema),
  initialValues: {
    name: '',
    phone: '',
    email: '',
    moveInDate: '',
    message: '',
  },
})

// ✅ valid + invalid
const submit = form.handleSubmit(
  (values) => {
    props.onSubmit({
      name: values.name,
      phone: values.phone,
      email: values.email || undefined,
      moveInDate: values.moveInDate,
      message: values.message || undefined,
    })
  },
  (ctx) => {
    // ✅ bấm submit là show lỗi ngay
    Object.keys(ctx?.errors ?? {}).forEach((name) => {
      form.setFieldTouched(name as any, true)
    })
  },
)

// Reset form khi dialog đóng
watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) form.resetForm()
  },
)
</script>

<template>
  <Dialog
    :open="open"
    @update:open="open = $event"
  >
    <DialogContent class="max-w-lg rounded-2xl">
      <DialogHeader>
        <DialogTitle>Gửi yêu cầu liên hệ</DialogTitle>
        <div class="mt-1 text-sm text-muted-foreground">
          {{ roomTitle }} • {{ moneyText }}
        </div>
      </DialogHeader>

      <!-- ✅ CHỈ 1 FORM HTML, không bọc <Form> nữa -->
      <form
        class="mt-4 grid gap-3"
        @submit.prevent="submit"
      >
        <FormField
          name="name"
          v-slot="{ componentField }"
        >
          <FormItem>
            <FormLabel>Họ và tên</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                placeholder="Nguyễn Văn A"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField
            name="phone"
            v-slot="{ componentField }"
          >
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="090xxxxxxx"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            name="email"
            v-slot="{ componentField }"
          >
            <FormItem>
              <FormLabel>Email (tuỳ chọn)</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="you@email.com"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <FormField
          name="moveInDate"
          v-slot="{ componentField }"
        >
          <FormItem>
            <FormLabel>Ngày dự kiến dọn vào</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="date"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField
          name="message"
          v-slot="{ componentField }"
        >
          <FormItem>
            <FormLabel>Ghi chú</FormLabel>
            <FormControl>
              <Textarea
                v-bind="componentField"
                rows="3"
                placeholder="Ví dụ: mình muốn xem phòng sau 18h, cần chỗ để xe..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <p
          v-if="isError"
          class="text-sm text-destructive"
        >
          Gửi yêu cầu thất bại. Vui lòng thử lại.
        </p>

        <DialogFooter class="mt-4 gap-2">
          <DialogClose as-child>
            <Button
              type="button"
              variant="outline"
              class="rounded-xl"
              :disabled="isPending"
            >
              Huỷ
            </Button>
          </DialogClose>

          <Button
            type="submit"
            class="rounded-xl"
            :disabled="isPending"
          >
            <span v-if="isPending">Đang gửi...</span>
            <span v-else>Gửi yêu cầu</span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
