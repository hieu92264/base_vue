<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue-sonner'

import { LandlordService } from '@/services/landlord.service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { IRoomPhoto } from '@/common/types/entities'
import {
  roomFormSchema,
  type RoomFormValues,
} from './-schemas/room-form.schema'
import RoomPhotoManager from './components/RoomPhotoManager.vue'

const route = useRoute()
const router = useRouter()
const queryClient = useQueryClient()

const roomId = computed<number | null>(() => {
  const id = Number(route.params.id)
  return Number.isFinite(id) && id > 0 ? id : null
})

const isEdit = computed(() => !!roomId.value)

const form = useForm({
  validationSchema: toTypedSchema(roomFormSchema),
  initialValues: {
    isactive: 'Y' as 'Y' | 'N',
    category_id: null as number | null,
    post_type_id: null as number | null,
    city_id: null as number | null,
    district_id: null as number | null,
    ward_id: null as number | null,
    title: '',
    slug: '',
    address: '',
    price: 0,
    area: null as number | null,
    description: '',
    booking_status: 'pending' as
      | 'pending'
      | 'confirmed'
      | 'available'
      | 'occupied',
  },
})

const roomDetailQuery = useQuery({
  queryKey: computed(() => ['landlord_room_detail_form', roomId.value]),
  queryFn: () => LandlordService.getMyRoomDetail(roomId.value as number),
  enabled: computed(() => !!roomId.value),
})

const categoriesQuery = useQuery({
  queryKey: ['landlord_categories_public'],
  queryFn: LandlordService.getCategories,
})

const postTypesQuery = useQuery({
  queryKey: ['landlord_post_types_public'],
  queryFn: LandlordService.getPostTypes,
})

const citiesQuery = useQuery({
  queryKey: ['landlord_cities'],
  queryFn: LandlordService.getCities,
})

const districtsQuery = useQuery({
  queryKey: computed(() => ['landlord_districts', form.values.city_id]),
  queryFn: () => LandlordService.getDistricts(form.values.city_id ?? ''),
  enabled: computed(() => !!form.values.city_id),
})

const wardsQuery = useQuery({
  queryKey: computed(() => [
    'landlord_wards',
    form.values.city_id,
    form.values.district_id,
  ]),
  queryFn: () =>
    LandlordService.getWards({
      city_id: form.values.city_id ?? '',
      district_id: form.values.district_id ?? '',
    }),
  enabled: computed(() => !!form.values.district_id),
})

const photos = ref<IRoomPhoto[]>([])
const isSaving = ref(false)
const isUploading = ref(false)

watch(
  () => roomDetailQuery.data.value,
  (room) => {
    if (!room) return

    form.setValues({
      isactive: (room.isactive as 'Y' | 'N') ?? 'Y',
      category_id: room.category_id ?? null,
      post_type_id: room.post_type_id ?? null,
      city_id: room.city_id ?? null,
      district_id: room.district_id ?? null,
      ward_id: room.ward_id ?? null,
      title: room.title ?? '',
      slug: room.slug ?? '',
      address: room.address ?? '',
      price: Number(room.price ?? 0),
      area: room.area != null ? Number(room.area) : null,
      description: room.description ?? '',
      booking_status:
        (room.booking_status as
          | 'pending'
          | 'confirmed'
          | 'available'
          | 'occupied') ?? 'pending',
    })

    photos.value = room.photos ?? []
  },
  { immediate: true },
)

watch(
  () => form.values.city_id,
  (newCity, oldCity) => {
    if (newCity !== oldCity) {
      form.setFieldValue('district_id', null)
      form.setFieldValue('ward_id', null)
    }
  },
)

watch(
  () => form.values.district_id,
  (newDistrict, oldDistrict) => {
    if (newDistrict !== oldDistrict) {
      form.setFieldValue('ward_id', null)
    }
  },
)

const categories = computed(() => categoriesQuery.data.value ?? [])
const postTypes = computed(() => postTypesQuery.data.value ?? [])
const cities = computed(() => citiesQuery.data.value ?? [])
const districts = computed(() => districtsQuery.data.value ?? [])
const wards = computed(() => wardsQuery.data.value ?? [])

const saveRoom = form.handleSubmit(async (values: RoomFormValues) => {
  isSaving.value = true

  try {
    let savedRoomId = roomId.value

    if (isEdit.value && roomId.value) {
      await LandlordService.updateMyRoom(roomId.value, values)
      toast.success('Cập nhật tin đăng thành công')
    } else {
      const created = await LandlordService.createMyRoom(values)
      savedRoomId = created.id
      toast.success('Tạo tin đăng thành công')
    }

    await queryClient.invalidateQueries({ queryKey: ['landlord_my_rooms'] })
    await queryClient.invalidateQueries({ queryKey: ['landlord_dashboard'] })

    if (!isEdit.value && savedRoomId) {
      router.replace({
        name: 'landlord.my-rooms.edit',
        params: { id: savedRoomId },
      })
    }
  } catch (error) {
    console.error(error)
    toast.error('Lưu tin đăng thất bại')
  } finally {
    isSaving.value = false
  }
})

const reloadPhotos = async () => {
  if (!roomId.value) return
  photos.value = await LandlordService.getRoomPhotos(roomId.value)
}

const handleUploadPhotos = async (files: FileList) => {
  if (!roomId.value) {
    toast.error('Hãy lưu tin đăng trước khi upload ảnh')
    return
  }

  isUploading.value = true

  try {
    const currentLength = photos.value.length

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)
      if (!file) continue

      await LandlordService.uploadRoomPhoto(roomId.value, file, {
        is_cover: currentLength === 0 && i === 0,
        sort_order: currentLength + i,
      })
    }

    await reloadPhotos()
    toast.success('Upload ảnh thành công')
  } catch (error) {
    console.error(error)
    toast.error('Upload ảnh thất bại')
  } finally {
    isUploading.value = false
  }
}

const handleSetCover = async (photo: IRoomPhoto) => {
  if (!roomId.value || !photo.id) return

  try {
    await LandlordService.updateRoomPhoto(roomId.value, photo.id, {
      is_cover: true,
    })
    await reloadPhotos()
    toast.success('Đã cập nhật ảnh cover')
  } catch (error) {
    console.error(error)
    toast.error('Cập nhật ảnh cover thất bại')
  }
}

const handleDeletePhoto = async (photo: IRoomPhoto) => {
  if (!roomId.value || !photo.id) return

  try {
    await LandlordService.deleteRoomPhoto(roomId.value, photo.id)
    await reloadPhotos()
    toast.success('Đã xóa ảnh')
  } catch (error) {
    console.error(error)
    toast.error('Xóa ảnh thất bại')
  }
}

const handleMovePhoto = async (photo: IRoomPhoto, direction: 'up' | 'down') => {
  if (!roomId.value || !photo.id) return

  const sorted = [...photos.value].sort(
    (a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0),
  )

  const index = sorted.findIndex((p) => p.id === photo.id)
  if (index < 0) return

  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= sorted.length) return

  const temp = sorted[index]!
  sorted[index] = sorted[targetIndex]!
  sorted[targetIndex] = temp

  const items = sorted
    .filter((item) => item.id != null)
    .map((item, idx) => ({
      id: Number(item.id),
      sort_order: idx,
    }))

  try {
    await LandlordService.sortRoomPhotos(roomId.value, items)
    await reloadPhotos()
    toast.success('Đã cập nhật thứ tự ảnh')
  } catch (error) {
    console.error(error)
    toast.error('Cập nhật thứ tự ảnh thất bại')
  }
}

const pageTitle = computed(() =>
  isEdit.value ? 'Cập nhật tin đăng' : 'Tạo tin đăng mới',
)
</script>

<template>
  <div class="space-y-4 px-4 py-3">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold">{{ pageTitle }}</h2>
        <p class="text-sm text-muted-foreground">
          Form tạo/sửa tin đăng với location, category, post type và hình ảnh
        </p>
      </div>

      <div class="flex gap-2">
        <Button
          variant="outline"
          @click="router.push({ name: 'landlord.my-rooms' })"
        >
          Quay lại
        </Button>

        <Button
          :disabled="isSaving"
          @click="saveRoom"
        >
          {{ isSaving ? 'Đang lưu...' : 'Lưu tin đăng' }}
        </Button>
      </div>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Thông tin cơ bản</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          class="space-y-4"
          @submit.prevent="saveRoom"
        >
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    placeholder="de-trong-se-tu-dong-tao"
                  />
                </FormControl>
                <FormMessage />
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
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="area"
            >
              <FormItem>
                <FormLabel>Diện tích</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    type="number"
                    placeholder="20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <FormField name="category_id">
              <FormItem>
                <FormLabel>Danh mục</FormLabel>
                <FormControl>
                  <select
                    class="w-full rounded-md border px-3 py-2 bg-background"
                    :value="form.values.category_id ?? ''"
                    @change="
                      form.setFieldValue(
                        'category_id',
                        ($event.target as HTMLSelectElement).value
                          ? Number(($event.target as HTMLSelectElement).value)
                          : null,
                      )
                    "
                  >
                    <option value="">Chọn danh mục</option>
                    <option
                      v-for="item in categories"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="post_type_id">
              <FormItem>
                <FormLabel>Loại bài đăng</FormLabel>
                <FormControl>
                  <select
                    class="w-full rounded-md border px-3 py-2 bg-background"
                    :value="form.values.post_type_id ?? ''"
                    @change="
                      form.setFieldValue(
                        'post_type_id',
                        ($event.target as HTMLSelectElement).value
                          ? Number(($event.target as HTMLSelectElement).value)
                          : null,
                      )
                    "
                  >
                    <option value="">Chọn loại bài đăng</option>
                    <option
                      v-for="item in postTypes"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="booking_status">
              <FormItem>
                <FormLabel>Trạng thái thuê</FormLabel>
                <FormControl>
                  <select
                    class="w-full rounded-md border px-3 py-2 bg-background"
                    :value="form.values.booking_status ?? 'pending'"
                    @change="
                      form.setFieldValue(
                        'booking_status',
                        ($event.target as HTMLSelectElement).value as
                          | 'pending'
                          | 'confirmed'
                          | 'available'
                          | 'occupied',
                      )
                    "
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="available">Còn trống</option>
                    <option value="occupied">Đã thuê</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField name="city_id">
              <FormItem>
                <FormLabel>Tỉnh/Thành phố</FormLabel>
                <FormControl>
                  <select
                    class="w-full rounded-md border px-3 py-2 bg-background"
                    :value="form.values.city_id ?? ''"
                    @change="
                      form.setFieldValue(
                        'city_id',
                        ($event.target as HTMLSelectElement).value
                          ? Number(($event.target as HTMLSelectElement).value)
                          : null,
                      )
                    "
                  >
                    <option value="">Chọn thành phố</option>
                    <option
                      v-for="item in cities"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="district_id">
              <FormItem>
                <FormLabel>Quận/Huyện</FormLabel>
                <FormControl>
                  <select
                    class="w-full rounded-md border px-3 py-2 bg-background"
                    :value="form.values.district_id ?? ''"
                    @change="
                      form.setFieldValue(
                        'district_id',
                        ($event.target as HTMLSelectElement).value
                          ? Number(($event.target as HTMLSelectElement).value)
                          : null,
                      )
                    "
                  >
                    <option value="">Chọn quận/huyện</option>
                    <option
                      v-for="item in districts"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="ward_id">
              <FormItem>
                <FormLabel>Phường/Xã</FormLabel>
                <FormControl>
                  <select
                    class="w-full rounded-md border px-3 py-2 bg-background"
                    :value="form.values.ward_id ?? ''"
                    @change="
                      form.setFieldValue(
                        'ward_id',
                        ($event.target as HTMLSelectElement).value
                          ? Number(($event.target as HTMLSelectElement).value)
                          : null,
                      )
                    "
                  >
                    <option value="">Chọn phường/xã</option>
                    <option
                      v-for="item in wards"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              v-slot="{ componentField }"
              name="address"
            >
              <FormItem>
                <FormLabel>Địa chỉ</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="Số nhà, tên đường..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="isactive">
              <FormItem>
                <FormLabel>Trạng thái hiển thị</FormLabel>
                <FormControl>
                  <select
                    class="w-full rounded-md border px-3 py-2 bg-background"
                    :value="form.values.isactive ?? 'Y'"
                    @change="
                      form.setFieldValue(
                        'isactive',
                        ($event.target as HTMLSelectElement).value as 'Y' | 'N',
                      )
                    "
                  >
                    <option value="Y">Hiển thị</option>
                    <option value="N">Tạm ẩn</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <FormField
            v-slot="{ componentField }"
            name="description"
          >
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  rows="6"
                  placeholder="Mô tả chi tiết phòng trọ..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </form>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Hình ảnh</CardTitle>
      </CardHeader>
      <CardContent>
        <RoomPhotoManager
          :photos="photos"
          :disabled="isUploading"
          @upload="handleUploadPhotos"
          @set-cover="handleSetCover"
          @delete="handleDeletePhoto"
          @sort-up="(photo) => handleMovePhoto(photo, 'up')"
          @sort-down="(photo) => handleMovePhoto(photo, 'down')"
        />
      </CardContent>
    </Card>
  </div>
</template>
