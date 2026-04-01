<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import {
  Search,
  CheckCircle2,
  XCircle,
  EyeOff,
  Clock3,
  RefreshCcw,
  MapPin,
  Wallet,
  UserRound,
  Phone,
  Mail,
} from 'lucide-vue-next'

import { LandlordService } from '@/services/landlord.service'
import type { IRoom } from '@/common/types/entities'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
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

const queryClient = useQueryClient()

const filters = ref({
  keyword: '',
  post_status: 'pending',
  page: 1,
  per_page: 10,
})

const searchParams = computed(() => ({
  keyword: filters.value.keyword || undefined,
  post_status:
    filters.value.post_status !== 'all' ? filters.value.post_status : undefined,
  page: filters.value.page,
  per_page: filters.value.per_page,
}))

const roomsQuery = useQuery({
  queryKey: computed(() => ['room_moderation_list', searchParams.value]),
  queryFn: () => LandlordService.getModerationRooms(searchParams.value),
})

const rooms = computed(() => roomsQuery.data.value?.data ?? [])
const meta = computed(() => roomsQuery.data.value?.meta)

const selectedRoomId = ref<number | null>(null)
const moderationNote = ref('')

watch(
  rooms,
  (nextRooms) => {
    if (!nextRooms.length) {
      selectedRoomId.value = null
      moderationNote.value = ''
      return
    }

    const exists = nextRooms.some((room) => room.id === selectedRoomId.value)
    if (!exists) {
      selectedRoomId.value = nextRooms[0]?.id ?? null
    }
  },
  { immediate: true },
)

const selectedRoom = computed<IRoom | null>(() => {
  const found = rooms.value.find((room) => room.id === selectedRoomId.value)
  return found ?? null
})

watch(
  selectedRoom,
  (room) => {
    moderationNote.value = room?.moderation_note ?? ''
  },
  { immediate: true },
)

const statusLabel = (status?: string) => {
  switch (status) {
    case 'approved':
      return 'Đã duyệt'
    case 'rejected':
      return 'Từ chối'
    case 'hidden':
      return 'Đã ẩn'
    default:
      return 'Chờ duyệt'
  }
}

const statusVariant = (status?: string) => {
  switch (status) {
    case 'approved':
      return 'default'
    case 'rejected':
      return 'destructive'
    case 'hidden':
      return 'secondary'
    default:
      return 'outline'
  }
}

const formatMoney = (value?: number | string | null) =>
  new Intl.NumberFormat('vi-VN').format(Number(value ?? 0))

const getCover = (room?: IRoom | null) =>
  room?.photos?.find((p) => p.is_cover)?.photo_url ||
  room?.photos?.[0]?.photo_url ||
  'https://placehold.co/800x500?text=Khong+co+anh'

const mutateStatus = useMutation({
  mutationFn: ({
    roomId,
    post_status,
    moderation_note,
  }: {
    roomId: number
    post_status: 'pending' | 'approved' | 'rejected' | 'hidden'
    moderation_note?: string | null
  }) =>
    LandlordService.updateModerationStatus(roomId, {
      post_status,
      moderation_note,
    }),
  onSuccess: () => {
    toast.success('Cập nhật duyệt bài thành công')
    queryClient.invalidateQueries({ queryKey: ['room_moderation_list'] })
    queryClient.invalidateQueries({ queryKey: ['landlord_my_rooms'] })
  },
  onError: () => {
    toast.error('Cập nhật duyệt bài thất bại')
  },
})

const applyStatus = (
  post_status: 'pending' | 'approved' | 'rejected' | 'hidden',
) => {
  if (!selectedRoom.value) return

  mutateStatus.mutate({
    roomId: selectedRoom.value.id,
    post_status,
    moderation_note: moderationNote.value || null,
  })
}
</script>

<template>
  <div class="space-y-4 px-4 py-4">
    <div>
      <h2 class="text-2xl font-bold">Duyệt bài đăng phòng trọ</h2>
      <p class="text-sm text-muted-foreground">
        Quản lý trạng thái pending / approved / rejected / hidden cho tin đăng
      </p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Bộ lọc</CardTitle>
      </CardHeader>
      <CardContent class="grid grid-cols-1 gap-3 md:grid-cols-4">
        <div class="relative md:col-span-2">
          <Search
            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            v-model="filters.keyword"
            class="pl-9"
            placeholder="Tìm theo tiêu đề, slug, địa chỉ"
            @keyup.enter="roomsQuery.refetch()"
          />
        </div>

        <Select
          :model-value="filters.post_status"
          @update:model-value="(v) => (filters.post_status = String(v))"
        >
          <SelectTrigger>
            <SelectValue placeholder="Trạng thái duyệt" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
            <SelectItem value="hidden">Đã ẩn</SelectItem>
          </SelectContent>
        </Select>

        <Button @click="roomsQuery.refetch()">Lọc dữ liệu</Button>
      </CardContent>
    </Card>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-5">
      <Card class="xl:col-span-3">
        <CardHeader>
          <CardTitle>Danh sách tin cần duyệt</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            v-if="roomsQuery.isLoading.value"
            class="py-10 text-center text-sm text-muted-foreground"
          >
            Đang tải dữ liệu...
          </div>

          <div
            v-else-if="rooms.length === 0"
            class="py-10 text-center text-sm text-muted-foreground"
          >
            Không có tin đăng phù hợp bộ lọc.
          </div>

          <Table v-else>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Chủ nhà</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow
                v-for="room in rooms"
                :key="room.id"
                class="cursor-pointer"
                :class="selectedRoomId === room.id ? 'bg-muted/60' : ''"
                @click="selectedRoomId = room.id"
              >
                <TableCell>#{{ room.id }}</TableCell>
                <TableCell>
                  <div class="font-medium">{{ room.title }}</div>
                  <div class="text-xs text-muted-foreground">
                    {{ room.address || room.slug }}
                  </div>
                </TableCell>
                <TableCell>
                  {{
                    room.owner?.profile?.full_name ||
                    room.owner?.username ||
                    room.owner?.email ||
                    '-'
                  }}
                </TableCell>
                <TableCell>{{ formatMoney(room.price) }} đ</TableCell>
                <TableCell>
                  <Badge :variant="statusVariant(room.post_status) as any">
                    {{ statusLabel(room.post_status) }}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div
            v-if="meta"
            class="mt-4 flex items-center justify-between"
          >
            <div class="text-sm text-muted-foreground">
              Tổng {{ meta.total }} tin • Trang {{ meta.current_page }}/{{
                meta.last_page
              }}
            </div>

            <div class="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                :disabled="filters.page <= 1"
                @click="filters.page -= 1"
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                :disabled="filters.page >= meta.last_page"
                @click="filters.page += 1"
              >
                Sau
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="xl:col-span-2">
        <CardHeader>
          <CardTitle>Chi tiết tin đăng</CardTitle>
        </CardHeader>
        <CardContent
          v-if="selectedRoom"
          class="space-y-4"
        >
          <img
            :src="getCover(selectedRoom)"
            class="h-60 w-full rounded-xl border object-cover"
          />

          <div class="space-y-2">
            <div class="flex items-center justify-between gap-2">
              <h3 class="text-lg font-semibold">{{ selectedRoom.title }}</h3>
              <Badge :variant="statusVariant(selectedRoom.post_status) as any">
                {{ statusLabel(selectedRoom.post_status) }}
              </Badge>
            </div>

            <div class="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin class="mt-0.5 h-4 w-4" />
              <span>{{ selectedRoom.address || 'Chưa có địa chỉ' }}</span>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <Wallet class="h-4 w-4" />
              <span>{{ formatMoney(selectedRoom.price) }} đ / tháng</span>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <UserRound class="h-4 w-4" />
              <span>
                {{
                  selectedRoom.owner?.profile?.full_name ||
                  selectedRoom.owner?.username ||
                  '-'
                }}
              </span>
            </div>

            <div
              v-if="selectedRoom.owner?.profile?.phone_number"
              class="flex items-center gap-2 text-sm"
            >
              <Phone class="h-4 w-4" />
              <span>{{ selectedRoom.owner?.profile?.phone_number }}</span>
            </div>

            <div
              v-if="selectedRoom.owner?.email"
              class="flex items-center gap-2 text-sm"
            >
              <Mail class="h-4 w-4" />
              <span>{{ selectedRoom.owner?.email }}</span>
            </div>
          </div>

          <div class="rounded-lg border p-3">
            <div class="mb-2 text-sm font-medium">Mô tả</div>
            <div class="text-sm text-muted-foreground whitespace-pre-line">
              {{ selectedRoom.description || 'Chưa có mô tả.' }}
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Ghi chú kiểm duyệt</label>
            <Textarea
              v-model="moderationNote"
              rows="5"
              placeholder="Ví dụ: Tin hợp lệ, thông tin rõ ràng, ảnh đúng nội dung..."
            />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <Button
              :disabled="mutateStatus.isPending.value"
              @click="applyStatus('approved')"
            >
              <CheckCircle2 class="mr-2 h-4 w-4" />
              Duyệt
            </Button>

            <Button
              variant="destructive"
              :disabled="mutateStatus.isPending.value"
              @click="applyStatus('rejected')"
            >
              <XCircle class="mr-2 h-4 w-4" />
              Từ chối
            </Button>

            <Button
              variant="outline"
              :disabled="mutateStatus.isPending.value"
              @click="applyStatus('hidden')"
            >
              <EyeOff class="mr-2 h-4 w-4" />
              Ẩn tin
            </Button>

            <Button
              variant="secondary"
              :disabled="mutateStatus.isPending.value"
              @click="applyStatus('pending')"
            >
              <Clock3 class="mr-2 h-4 w-4" />
              Về pending
            </Button>
          </div>

          <Button
            variant="ghost"
            class="w-full"
            :disabled="roomsQuery.isFetching.value"
            @click="roomsQuery.refetch()"
          >
            <RefreshCcw class="mr-2 h-4 w-4" />
            Tải lại dữ liệu
          </Button>
        </CardContent>

        <CardContent v-else>
          <div class="py-10 text-center text-sm text-muted-foreground">
            Chọn một tin đăng bên trái để xem chi tiết.
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
