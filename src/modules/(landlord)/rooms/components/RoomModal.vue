<script setup lang="ts">
import type { ICategory, IPostType, IRoom } from '@/common/types/entities'
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
  FormMessage,
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
import { computed, watch } from 'vue'
import { roomFormSchema, type RoomFormValues } from '../-schemas/room.schema'

const props = defineProps<{
  open: boolean
  isPending: boolean
  initialData?: IRoom | null
  categories: ICategory[]
  postTypes: IPostType[]
  handleSubmit: (data: RoomFormValues) => void
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const form = useForm({
  validationSchema: toTypedSchema(roomFormSchema),
  initialValues: {
    isactive: 'Y',
    category_id: null,
    post_type_id: null,
    city_id: null,
    district_id: null,
    ward_id: null,
    title: '',
    slug: '',
    address: '',
    price: 0,
    area: null,
    description: '',
    booking_status: 'pending',
    photos: [],
  },
})

const photoText = computed({
  get() {
    const photos = form.values.photos ?? []
    return photos.map((p) => p.photo_url).join('\n')
  },
  set(value: string) {
    const items = value
      .split('\n')
      .map((s, index) => ({
        photo_url: s.trim(),
        is_cover: index === 0,
        sort_order: index,
      }))
      .filter((item) => item.photo_url.length > 0)

    form.setFieldValue('photos', items)
  },
})

const onSubmit = form.handleSubmit((values) => {
  props.handleSubmit(values)
})

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.setValues({
        isactive: (newData.isactive as 'Y' | 'N') ?? 'Y',
        category_id: newData.category_id ?? null,
        post_type_id: newData.post_type_id ?? null,
        city_id: newData.city_id ?? null,
        district_id: newData.district_id ?? null,
        ward_id: newData.ward_id ?? null,
        title: newData.title ?? '',
        slug: newData.slug ?? '',
        address: newData.address ?? '',
        price: Number(newData.price ?? 0),
        area: newData.area ? Number(newData.area) : null,
        description: newData.description ?? '',
        booking_status: (newData.booking_status as any) ?? 'pending',
        photos:
          newData.photos?.map((photo, index) => ({
            id: photo.id,
            photo_url: photo.photo_url ?? '',
            is_cover: photo.is_cover ?? index === 0,
            sort_order: photo.sort_order ?? index,
          })) ?? [],
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
    <DialogContent class="sm:max-w-3xl max-h-[90vh] overflow-auto">
      <DialogHeader>
        <DialogTitle>
          {{ initialData ? 'Cập nhật tin đăng' : 'Tạo tin đăng mới' }}
        </DialogTitle>
        <DialogDescription>
          Nhập thông tin bài đăng phòng trọ của bạn
        </DialogDescription>
      </DialogHeader>

      <form
        class="space-y-4"
        @submit.prevent="onSubmit"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            v-slot="{ componentField }"
            name="title"
          >
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="Nhập tiêu đề tin đăng"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="slug"
          >
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="tu-dong-neu-bo-trong"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="category_id"
          >
            <FormItem>
              <FormLabel>Danh mục</FormLabel>
              <FormControl>
                <Select
                  :model-value="
                    componentField.modelValue
                      ? String(componentField.modelValue)
                      : undefined
                  "
                  @update:model-value="
                    (v) =>
                      componentField['onUpdate:modelValue']?.(
                        v ? Number(v) : null,
                      )
                  "
                >
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="item in categories"
                      :key="item.id"
                      :value="String(item.id)"
                    >
                      {{ item.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="post_type_id"
          >
            <FormItem>
              <FormLabel>Loại bài đăng</FormLabel>
              <FormControl>
                <Select
                  :model-value="
                    componentField.modelValue
                      ? String(componentField.modelValue)
                      : undefined
                  "
                  @update:model-value="
                    (v) =>
                      componentField['onUpdate:modelValue']?.(
                        v ? Number(v) : null,
                      )
                  "
                >
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Chọn loại bài đăng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="item in postTypes"
                      :key="item.id"
                      :value="String(item.id)"
                    >
                      {{ item.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="price"
          >
            <FormItem>
              <FormLabel>Giá</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="number"
                  placeholder="3000000"
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="area"
          >
            <FormItem>
              <FormLabel>Diện tích (m²)</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="number"
                  placeholder="20"
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="booking_status"
          >
            <FormItem>
              <FormLabel>Trạng thái thuê</FormLabel>
              <FormControl>
                <Select
                  :model-value="componentField.modelValue"
                  @update:model-value="componentField['onUpdate:modelValue']"
                >
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                    <SelectItem value="available">Còn trống</SelectItem>
                    <SelectItem value="occupied">Đã thuê</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="isactive"
          >
            <FormItem>
              <FormLabel>Trạng thái hiển thị</FormLabel>
              <FormControl>
                <Select
                  :model-value="componentField.modelValue"
                  @update:model-value="componentField['onUpdate:modelValue']"
                >
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Y">Đang hoạt động</SelectItem>
                    <SelectItem value="N">Tạm ẩn</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          </FormField>
        </div>

        <FormField
          v-slot="{ componentField }"
          name="address"
        >
          <FormItem>
            <FormLabel>Địa chỉ</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                placeholder="Nhập địa chỉ phòng trọ"
              />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField
          v-slot="{ componentField }"
          name="description"
        >
          <FormItem>
            <FormLabel>Mô tả</FormLabel>
            <FormControl>
              <Textarea
                v-bind="componentField"
                rows="5"
                placeholder="Mô tả chi tiết phòng trọ"
              />
            </FormControl>
          </FormItem>
        </FormField>

        <div class="space-y-2">
          <FormLabel>Danh sách ảnh</FormLabel>
          <Textarea
            :model-value="photoText"
            @update:model-value="(v) => (photoText = String(v ?? ''))"
            rows="6"
            placeholder="Mỗi dòng là 1 URL ảnh"
          />
          <p class="text-xs text-muted-foreground">
            Dòng đầu tiên sẽ được xem là ảnh cover
          </p>
        </div>

        <DialogFooter>
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
