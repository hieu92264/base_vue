<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog.vue'
import { Plus, Pencil, Trash2, Search, RefreshCcw } from 'lucide-vue-next'
import { useQuery } from '@tanstack/vue-query'
import { LandlordService } from '@/services/landlord.service'
import RoomModal from './components/RoomModal.vue'
import type { IRoom } from '@/common/types/entities'
import type { RoomFormValues } from './-schemas/room.schema'
import {
  useCreateLandlordRoomMutation,
  useDeleteLandlordRoomMutation,
  useLandlordRoomsQuery,
  useUpdateLandlordRoomMutation,
} from './hooks/use-landlord-rooms'
import { useRouter } from 'vue-router'

const router = useRouter()

const filters = ref({
  keyword: '',
  booking_status: 'all',
  isactive: 'all',
  sort: 'latest',
  page: 1,
  per_page: 10,
})

const searchParams = computed(() => ({
  keyword: filters.value.keyword || undefined,
  booking_status:
    filters.value.booking_status !== 'all'
      ? filters.value.booking_status
      : undefined,
  isactive:
    filters.value.isactive !== 'all' ? filters.value.isactive : undefined,
  sort: filters.value.sort,
  page: filters.value.page,
  per_page: filters.value.per_page,
}))

const { data, isLoading, isFetching, refetch } =
  useLandlordRoomsQuery(searchParams)

const categoriesQuery = useQuery({
  queryKey: ['landlord_categories'],
  queryFn: LandlordService.getCategories,
})

const postTypesQuery = useQuery({
  queryKey: ['landlord_post_types'],
  queryFn: LandlordService.getPostTypes,
})

const categories = computed(() => categoriesQuery.data.value ?? [])
const postTypes = computed(() => postTypesQuery.data.value ?? [])

const { mutate: createRoom, isPending: isCreating } =
  useCreateLandlordRoomMutation()
const { mutate: updateRoom, isPending: isUpdating } =
  useUpdateLandlordRoomMutation()
const { mutate: deleteRoom, isPending: isDeleting } =
  useDeleteLandlordRoomMutation()

const rooms = computed(() => data.value?.data ?? [])
const meta = computed(() => {
  return (
    data.value?.meta ?? {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    }
  )
})

const modalOpen = ref(false)
const selectedRoom = ref<IRoom | null>(null)
const openDelete = ref(false)

const openCreateModal = () => {
  selectedRoom.value = null
  modalOpen.value = true
}

const openEditModal = (room: IRoom) => {
  selectedRoom.value = room
  modalOpen.value = true
}

const openDeleteDialog = (room: IRoom) => {
  selectedRoom.value = room
  openDelete.value = true
}

const handleSubmit = (payload: RoomFormValues) => {
  const onSuccess = () => {
    modalOpen.value = false
    selectedRoom.value = null
  }

  if (selectedRoom.value) {
    updateRoom(
      {
        id: selectedRoom.value.id,
        payload,
      },
      { onSuccess },
    )
  } else {
    createRoom(payload, { onSuccess })
  }
}

const confirmDelete = () => {
  if (!selectedRoom.value) return
  deleteRoom(selectedRoom.value.id, {
    onSuccess: () => {
      openDelete.value = false
      selectedRoom.value = null
    },
  })
}

const statusLabel = (status?: string) => {
  switch (status) {
    case 'available':
      return 'Còn trống'
    case 'occupied':
      return 'Đã thuê'
    case 'confirmed':
      return 'Đã xác nhận'
    default:
      return 'Chờ xử lý'
  }
}

const activeLabel = (status?: string) =>
  status === 'Y' ? 'Hiển thị' : 'Tạm ẩn'

const formatMoney = (value?: number) => {
  return new Intl.NumberFormat('vi-VN').format(Number(value ?? 0))
}

const applyFilters = () => {
  filters.value.page = 1
  refetch()
}
</script>

<template>
  <div class="space-y-4 px-4 py-3">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold">Danh sách tin của tôi</h2>
        <p class="text-sm text-muted-foreground">
          Quản lý các tin đăng phòng trọ của chủ nhà
        </p>
      </div>

      <Button @click="router.push({ name: 'landlord.my-rooms.create' })">
        <Plus class="mr-2 h-4 w-4" />
        Tạo tin mới
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Bộ lọc</CardTitle>
      </CardHeader>
      <CardContent class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <div class="relative lg:col-span-2">
          <Search
            class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          />
          <Input
            v-model="filters.keyword"
            class="pl-9"
            placeholder="Tìm theo tiêu đề, slug, địa chỉ..."
            @keyup.enter="filters.page = 1"
          />
        </div>

        <Select
          :model-value="filters.booking_status"
          @update:model-value="(v) => (filters.booking_status = String(v))"
        >
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Trạng thái thuê" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái thuê</SelectItem>
            <SelectItem value="pending">Chờ xử lý</SelectItem>
            <SelectItem value="confirmed">Đã xác nhận</SelectItem>
            <SelectItem value="available">Còn trống</SelectItem>
            <SelectItem value="occupied">Đã thuê</SelectItem>
          </SelectContent>
        </Select>

        <Select
          :model-value="filters.isactive"
          @update:model-value="(v) => (filters.isactive = String(v))"
        >
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Trạng thái hiển thị" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả hiển thị</SelectItem>
            <SelectItem value="Y">Hiển thị</SelectItem>
            <SelectItem value="N">Tạm ẩn</SelectItem>
          </SelectContent>
        </Select>

        <Select
          :model-value="filters.sort"
          @update:model-value="(v) => (filters.sort = String(v))"
        >
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Mới nhất</SelectItem>
            <SelectItem value="oldest">Cũ nhất</SelectItem>
            <SelectItem value="price_asc">Giá tăng dần</SelectItem>
            <SelectItem value="price_desc">Giá giảm dần</SelectItem>
            <SelectItem value="area_asc">Diện tích tăng dần</SelectItem>
            <SelectItem value="area_desc">Diện tích giảm dần</SelectItem>
          </SelectContent>
        </Select>

        <div class="lg:col-span-5 flex items-center gap-2">
          <Button
            variant="outline"
            @click="applyFilters()"
          >
            <RefreshCcw class="mr-2 h-4 w-4" />
            Áp dụng
          </Button>

          <Button
            variant="ghost"
            @click="
              filters = {
                keyword: '',
                booking_status: 'all',
                isactive: 'all',
                sort: 'latest',
                page: 1,
                per_page: 10,
              }
            "
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent class="p-0">
        <Table class="min-w-[920px]">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Diện tích</TableHead>
              <TableHead>Trạng thái thuê</TableHead>
              <TableHead>Hiển thị</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead class="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow v-if="isLoading || isFetching">
              <TableCell
                colspan="8"
                class="text-center py-8"
              >
                Đang tải dữ liệu...
              </TableCell>
            </TableRow>

            <TableRow v-else-if="rooms.length === 0">
              <TableCell
                colspan="8"
                class="text-center py-8"
              >
                Chưa có tin đăng nào
              </TableCell>
            </TableRow>

            <TableRow
              v-for="room in rooms"
              :key="room.id"
            >
              <TableCell class="whitespace-nowrap">#{{ room.id }}</TableCell>
              <TableCell class="align-top">
                <div class="max-w-[280px] min-w-0">
                  <div class="font-medium line-clamp-1">{{ room.title }}</div>
                  <div class="text-xs text-muted-foreground line-clamp-1">
                    {{ room.address || 'Chưa cập nhật địa chỉ' }}
                  </div>
                </div>
              </TableCell>
              <TableCell class="whitespace-nowrap">{{ formatMoney(room.price) }} đ</TableCell>
              <TableCell class="whitespace-nowrap">{{ room.area || 0 }} m²</TableCell>
              <TableCell class="whitespace-nowrap">
                <Badge variant="outline">
                  {{ statusLabel(room.booking_status) }}
                </Badge>
              </TableCell>
              <TableCell class="whitespace-nowrap">
                <Badge
                  :variant="room.isactive === 'Y' ? 'default' : 'secondary'"
                >
                  {{ activeLabel(room.isactive) }}
                </Badge>
              </TableCell>
              <TableCell class="whitespace-nowrap">{{ room.created_at || '--' }}</TableCell>
              <TableCell class="text-right whitespace-nowrap">
                <div class="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    @click="
                      router.push({
                        name: 'landlord.my-rooms.edit',
                        params: { id: room.id },
                      })
                    "
                  >
                    <Pencil class="h-4 w-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    @click="openDeleteDialog(room)"
                  >
                    <Trash2 class="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div class="flex items-center justify-between px-4 py-3 border-t">
          <div class="text-sm text-muted-foreground">
            Tổng cộng {{ meta.total }} tin đăng
          </div>

          <Pagination
            :items-per-page="meta.per_page"
            :total="meta.total"
            :default-page="meta.current_page"
          >
            <PaginationContent>
              <PaginationPrevious
                href="#"
                :class="{
                  'pointer-events-none opacity-50': meta.current_page <= 1,
                }"
                @click.prevent="
                  meta.current_page > 1 &&
                  (filters.page = meta.current_page - 1)
                "
              />

              <span class="px-3 text-sm">
                Trang {{ meta.current_page }} / {{ meta.last_page }}
              </span>

              <PaginationNext
                href="#"
                :class="{
                  'pointer-events-none opacity-50':
                    meta.current_page >= meta.last_page,
                }"
                @click.prevent="
                  meta.current_page < meta.last_page &&
                  (filters.page = meta.current_page + 1)
                "
              />
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>

    <RoomModal
      :open="modalOpen"
      :is-pending="isCreating || isUpdating"
      :initial-data="selectedRoom"
      :categories="categories"
      :post-types="postTypes"
      :handle-submit="handleSubmit"
      @update:open="
        (v) => {
          modalOpen = v
          if (!v) selectedRoom = null
        }
      "
    />

    <DeleteConfirmDialog
      v-model:is-open-confirm="openDelete"
      @confirm-delete="confirmDelete"
    />
  </div>
</template>
