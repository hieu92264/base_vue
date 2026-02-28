<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Nếu bạn đang dùng shadcn-vue / components riêng thì thay import theo project của bạn
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type Photo = {
  id: number
  room_id: number
  photo_url: string
  is_cover: boolean
  sort_order: number
}

type Room = {
  id: number
  title: string
  address: string
  price: string
  area: string
  description: string
  booking_status: string
  created_at: string
  post_type?: { name: string; code: string }
  photos: Photo[]
  owner_user_id: number
}

const route = useRoute()
const router = useRouter()

// DEMO data theo mẫu bạn gửi (thực tế: fetch theo route.params.id)
const room = ref<Room | null>(null)

onMounted(async () => {
  // TODO: thay bằng API của bạn: GET /rooms/:id
  // const id = route.params.id
  // room.value = await api.getRoomDetail(id)

  room.value = {
    id: 2,
    title: 'Laudantium repellat voluptas ex accusantium.',
    address: '431 Boyer Trail\nPort Montanaville, CT 73581',
    price: '13211193.59',
    area: '45.06',
    description:
      'Et dolores dolorum animi dolorum nulla aliquid quia. Et error expedita dolor est et. Et omnis sit voluptates sit libero aspernatur nihil ut. Nihil ut nemo fugit dolores iste iste numquam laborum. Qui facilis ullam necessitatibus eligendi recusandae ad sed. Sit minus non ut odit quia mollitia quibusdam.',
    booking_status: 'confirmed',
    created_at: '2026-02-28T01:53:02.000000Z',
    owner_user_id: 18,
    post_type: { name: 'Aut Aspernatur', code: 'POST-260' },
    photos: [
      {
        id: 6,
        room_id: 2,
        photo_url:
          'https://dntt.mediacdn.vn/197608888129458176/2024/1/30/thue-nha--1706596306969965744045.jpeg',
        is_cover: false,
        sort_order: 17,
      },
      {
        id: 7,
        room_id: 2,
        photo_url:
          'https://dntt.mediacdn.vn/197608888129458176/2024/1/30/thue-nha--1706596306969965744045.jpeg',
        is_cover: false,
        sort_order: 17,
      },
      {
        id: 8,
        room_id: 2,
        photo_url:
          'https://dntt.mediacdn.vn/197608888129458176/2024/1/30/thue-nha--1706596306969965744045.jpeg',
        is_cover: false,
        sort_order: 3,
      },
      {
        id: 9,
        room_id: 2,
        photo_url:
          'https://dntt.mediacdn.vn/197608888129458176/2024/1/30/thue-nha--1706596306969965744045.jpeg',
        is_cover: false,
        sort_order: 13,
      },
      {
        id: 10,
        room_id: 2,
        photo_url:
          'https://dntt.mediacdn.vn/197608888129458176/2024/1/30/thue-nha--1706596306969965744045.jpeg',
        is_cover: false,
        sort_order: 16,
      },
      {
        id: 5,
        room_id: 2,
        photo_url:
          'https://dntt.mediacdn.vn/197608888129458176/2024/1/30/thue-nha--1706596306969965744045.jpeg',
        is_cover: true,
        sort_order: 0,
      },
    ],
  }
})

const photosSorted = computed(() => {
  if (!room.value) return []
  // cover trước, rồi sort_order tăng dần
  return [...room.value.photos].sort((a, b) => {
    if (a.is_cover && !b.is_cover) return -1
    if (!a.is_cover && b.is_cover) return 1
    return (a.sort_order ?? 999) - (b.sort_order ?? 999)
  })
})

const activePhoto = ref<string>('')
const coverPhoto = computed(
  () =>
    photosSorted.value.find((p) => p.is_cover)?.photo_url ||
    photosSorted.value[0]?.photo_url ||
    '',
)

onMounted(() => {
  // set activePhoto sau khi room được gán
  // (đơn giản: watch room)
})

const formatMoneyVND = (value: string) => {
  const n = Number(value || 0)
  if (Number.isNaN(n)) return value
  return n.toLocaleString('vi-VN') + ' ₫'
}

const formatDateTime = (iso: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d)
}

// Modal booking
const openBooking = ref(false)
const booking = reactive({
  fullName: '',
  phone: '',
  email: '',
  moveInDate: '',
  note: '',
})

const errors = ref<Record<string, string>>({})

const validateBooking = () => {
  const e: Record<string, string> = {}
  if (!booking.fullName.trim()) e.fullName = 'Vui lòng nhập họ tên.'
  if (!booking.phone.trim()) e.phone = 'Vui lòng nhập số điện thoại.'
  if (booking.email && !/^\S+@\S+\.\S+$/.test(booking.email))
    e.email = 'Email không hợp lệ.'
  if (!booking.moveInDate) e.moveInDate = 'Vui lòng chọn ngày dự kiến dọn vào.'
  errors.value = e
  return Object.keys(e).length === 0
}

const submitBooking = async () => {
  if (!room.value) return
  if (!validateBooking()) return

  // TODO: call API tạo booking
  // await api.createBooking({ room_id: room.value.id, ...booking })
  openBooking.value = false

  // reset nhẹ
  booking.fullName = ''
  booking.phone = ''
  booking.email = ''
  booking.moveInDate = ''
  booking.note = ''
  errors.value = {}

  // có thể toast success ở đây
}
</script>

<template>
  <div class="mx-auto w-full max-w-6xl px-4 py-8">
    <!-- Top bar -->
    <div
      class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex items-center gap-2">
        <Button
          variant="ghost"
          class="px-2"
          @click="router.back()"
          >← Quay lại</Button
        >
        <Separator
          orientation="vertical"
          class="hidden h-6 sm:block"
        />
        <div class="text-sm text-muted-foreground">
          Room #{{ route.params.id }}
        </div>
      </div>

      <div class="flex items-center gap-2">
        <Badge
          v-if="room?.booking_status"
          variant="secondary"
          class="capitalize"
        >
          {{ room.booking_status }}
        </Badge>
        <Badge
          v-if="room?.post_type?.name"
          class="gap-1"
        >
          {{ room.post_type.name }}
          <span class="opacity-70">({{ room.post_type.code }})</span>
        </Badge>
      </div>
    </div>

    <div
      v-if="!room"
      class="rounded-2xl border border-border/60 bg-card/60 p-6"
    >
      Đang tải dữ liệu...
    </div>

    <div
      v-else
      class="grid grid-cols-1 gap-6 lg:grid-cols-12"
    >
      <!-- Left: Gallery -->
      <div class="lg:col-span-7">
        <Card
          class="overflow-hidden rounded-2xl border-border/60 bg-card/80 shadow-sm"
        >
          <div class="relative aspect-[4/3] bg-muted">
            <img
              :src="activePhoto || coverPhoto"
              class="h-full w-full object-cover"
              alt="room"
            />
            <div
              class="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent"
            />
            <div
              class="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3"
            >
              <div class="min-w-0">
                <div class="truncate text-lg font-semibold text-white">
                  {{ room.title }}
                </div>
                <div class="truncate text-sm text-white/80">
                  {{ room.address }}
                </div>
              </div>

              <div class="shrink-0 rounded-xl bg-black/55 px-3 py-2 text-right">
                <div class="text-sm font-semibold text-white">
                  {{ formatMoneyVND(room.price) }}
                </div>
                <div class="text-xs text-white/80">{{ room.area }} m²</div>
              </div>
            </div>
          </div>

          <CardContent class="p-4">
            <div class="flex items-center justify-between">
              <div class="text-sm text-muted-foreground">
                Cập nhật: {{ formatDateTime(room.created_at) }}
              </div>
              <Button
                variant="secondary"
                class="rounded-xl"
                @click="openBooking = true"
              >
                Đặt phòng
              </Button>
            </div>

            <div
              v-if="photosSorted.length"
              class="mt-4"
            >
              <div class="flex gap-2 overflow-x-auto pb-1">
                <button
                  v-for="p in photosSorted"
                  :key="p.id"
                  class="group relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted"
                  @click="activePhoto = p.photo_url"
                >
                  <img
                    :src="p.photo_url"
                    class="h-full w-full object-cover transition group-hover:scale-105"
                    alt="thumb"
                  />
                  <div
                    v-if="p.photo_url === (activePhoto || coverPhoto)"
                    class="absolute inset-0 ring-2 ring-primary"
                  />
                  <div
                    v-if="p.is_cover"
                    class="absolute left-1 top-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white"
                  >
                    Cover
                  </div>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right: Info -->
      <div class="lg:col-span-5 space-y-6">
        <!-- Pricing / quick stats -->
        <Card class="rounded-2xl border-border/60 bg-card/80 shadow-sm">
          <CardHeader class="pb-2">
            <CardTitle class="text-base">Thông tin phòng</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div
                class="rounded-xl border border-border/60 bg-background/40 p-3"
              >
                <div class="text-xs text-muted-foreground">Giá</div>
                <div class="mt-1 text-sm font-semibold">
                  {{ formatMoneyVND(room.price) }}
                </div>
              </div>
              <div
                class="rounded-xl border border-border/60 bg-background/40 p-3"
              >
                <div class="text-xs text-muted-foreground">Diện tích</div>
                <div class="mt-1 text-sm font-semibold">{{ room.area }} m²</div>
              </div>
              <div
                class="rounded-xl border border-border/60 bg-background/40 p-3"
              >
                <div class="text-xs text-muted-foreground">Trạng thái</div>
                <div class="mt-1 text-sm font-semibold capitalize">
                  {{ room.booking_status }}
                </div>
              </div>
              <div
                class="rounded-xl border border-border/60 bg-background/40 p-3"
              >
                <div class="text-xs text-muted-foreground">Mã phòng</div>
                <div class="mt-1 text-sm font-semibold">#{{ room.id }}</div>
              </div>
            </div>

            <div
              class="rounded-xl border border-border/60 bg-background/40 p-3"
            >
              <div class="text-xs text-muted-foreground">Địa chỉ</div>
              <div class="mt-1 whitespace-pre-line text-sm">
                {{ room.address }}
              </div>
            </div>

            <Button
              class="w-full rounded-xl"
              size="lg"
              @click="openBooking = true"
            >
              Đặt phòng ngay
            </Button>

            <div class="text-xs text-muted-foreground">
              * Bấm “Đặt phòng” để gửi thông tin, hệ thống sẽ liên hệ xác nhận.
            </div>
          </CardContent>
        </Card>

        <!-- Description -->
        <Card class="rounded-2xl border-border/60 bg-card/80 shadow-sm">
          <CardHeader class="pb-2">
            <CardTitle class="text-base">Mô tả</CardTitle>
          </CardHeader>
          <CardContent>
            <p
              class="whitespace-pre-line text-sm leading-relaxed text-foreground/90"
            >
              {{ room.description }}
            </p>
          </CardContent>
        </Card>

        <!-- Contact -->
        <Card class="rounded-2xl border-border/60 bg-card/80 shadow-sm">
          <CardHeader class="pb-2">
            <CardTitle class="text-base">Thông tin liên hệ</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div
              class="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3"
            >
              <div>
                <div class="text-xs text-muted-foreground">
                  Chủ phòng (owner_user_id)
                </div>
                <div class="mt-1 text-sm font-semibold">
                  User #{{ room.owner_user_id }}
                </div>
              </div>
              <Badge variant="secondary">Verified</Badge>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                class="rounded-xl"
              >
                Gọi điện
              </Button>
              <Button
                variant="outline"
                class="rounded-xl"
              >
                Nhắn tin
              </Button>
            </div>

            <div class="text-xs text-muted-foreground">
              * Phần “Gọi điện/Nhắn tin” bạn có thể nối vào dữ liệu user thật
              (phone/zalo/email).
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Booking Modal -->
    <Dialog
      :open="openBooking"
      @update:open="openBooking = $event"
    >
      <DialogContent class="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Đặt phòng</DialogTitle>
          <div class="mt-1 text-sm text-muted-foreground">
            {{ room?.title }} • {{ formatMoneyVND(room?.price || '0') }} •
            {{ room?.area }} m²
          </div>
        </DialogHeader>

        <div class="mt-4 grid gap-3">
          <div>
            <div class="mb-1 text-sm font-medium">Họ và tên</div>
            <Input
              v-model="booking.fullName"
              placeholder="Nguyễn Văn A"
            />
            <p
              v-if="errors.fullName"
              class="mt-1 text-xs text-destructive"
            >
              {{ errors.fullName }}
            </p>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <div class="mb-1 text-sm font-medium">Số điện thoại</div>
              <Input
                v-model="booking.phone"
                placeholder="090xxxxxxx"
              />
              <p
                v-if="errors.phone"
                class="mt-1 text-xs text-destructive"
              >
                {{ errors.phone }}
              </p>
            </div>
            <div>
              <div class="mb-1 text-sm font-medium">Email (tuỳ chọn)</div>
              <Input
                v-model="booking.email"
                placeholder="you@email.com"
              />
              <p
                v-if="errors.email"
                class="mt-1 text-xs text-destructive"
              >
                {{ errors.email }}
              </p>
            </div>
          </div>

          <div>
            <div class="mb-1 text-sm font-medium">Ngày dự kiến dọn vào</div>
            <Input
              v-model="booking.moveInDate"
              type="date"
            />
            <p
              v-if="errors.moveInDate"
              class="mt-1 text-xs text-destructive"
            >
              {{ errors.moveInDate }}
            </p>
          </div>

          <div>
            <div class="mb-1 text-sm font-medium">Ghi chú</div>
            <Textarea
              v-model="booking.note"
              rows="3"
              placeholder="Ví dụ: muốn xem phòng lúc 7h tối..."
            />
          </div>
        </div>

        <DialogFooter class="mt-4 gap-2">
          <Button
            variant="outline"
            class="rounded-xl"
            @click="openBooking = false"
          >
            Huỷ
          </Button>
          <Button
            class="rounded-xl"
            @click="submitBooking"
          >
            Gửi yêu cầu đặt phòng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
