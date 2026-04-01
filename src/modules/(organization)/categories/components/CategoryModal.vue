<script setup lang="ts">
import { RecordStatus } from '@/common/constants/enums'
import type { ICategory } from '@/common/types/entities'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { watch } from 'vue'
import {
  categoryFormSchema,
  type CategoryFormValues,
} from '../-schemas/category.schema'

const props = defineProps<{
  open: boolean
  isPending: boolean
  initialData?: ICategory | null
  handleSubmit: (data: CategoryFormValues) => void
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const form = useForm({
  validationSchema: toTypedSchema(categoryFormSchema),
  initialValues: {
    id: undefined,
    isactive: RecordStatus.ACTIVE,
    code: '',
    name: '',
    slug: '',
    sort_order: 0,
    remark: '',
  },
})

const onSubmit = form.handleSubmit((values) => {
  props.handleSubmit(values)
})

const closeModal = () => emit('update:open', false)

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.setValues({
        id: newData.id,
        isactive: newData.isactive ?? RecordStatus.ACTIVE,
        code: newData.code ?? '',
        name: newData.name ?? '',
        slug: newData.slug ?? '',
        sort_order: Number(newData.sort_order ?? 0),
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
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>
          {{ initialData ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới' }}
        </DialogTitle>
        <DialogDescription>
          Điền thông tin danh mục rồi bấm Lưu để hoàn tất.
        </DialogDescription>
      </DialogHeader>

      <form
        class="space-y-6"
        @submit.prevent="onSubmit"
      >
        <div class="grid gap-4">
          <div class="grid grid-cols-2 gap-4">
            <FormField
              v-slot="{ componentField }"
              name="code"
            >
              <FormItem>
                <FormLabel>Mã danh mục</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="Nhập mã danh mục"
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="isactive"
            >
              <FormItem>
                <FormLabel>Trạng thái</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem :value="RecordStatus.ACTIVE"
                        >Hoạt động</SelectItem
                      >
                      <SelectItem :value="RecordStatus.INACTIVE"
                        >Ngưng hoạt động</SelectItem
                      >
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            </FormField>
          </div>

          <FormField
            v-slot="{ componentField }"
            name="name"
          >
            <FormItem>
              <FormLabel>Tên danh mục</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="Nhập tên danh mục"
                />
              </FormControl>
            </FormItem>
          </FormField>

          <div class="grid grid-cols-2 gap-4">
            <FormField
              v-slot="{ componentField }"
              name="slug"
            >
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="Nhập slug"
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="sort_order"
            >
              <FormItem>
                <FormLabel>Thứ tự hiển thị</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    type="number"
                    placeholder="0"
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>

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
                  rows="4"
                />
              </FormControl>
            </FormItem>
          </FormField>
        </div>

        <DialogFooter class="mt-4!">
          <Button
            type="button"
            variant="outline"
            @click="closeModal"
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
