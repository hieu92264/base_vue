<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMutation } from '@tanstack/vue-query'
import axios from 'axios'

// shadcn-vue
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

import RoomContactDialog from '@/modules/(general)/home/components/RoomContactDialog.vue'
import {
  useContactMutaion,
  useRoomDetailsQuery,
} from '@/modules/(general)/home/hooks/use-home'
import type { ContactFormValues } from '@/modules/(general)/home/-schemas/contact.schema'

// -------------------- Types --------------------
type RoomPhoto = {
  id: number
  room_id: number
  photo_url: string | null
  is_cover: boolean
  sort_order: number
  created_at?: string | null
  updated_at?: string | null
}

type NamedEntity = { id: number; name: string }

type OwnerProfile = {
  full_name: string | null
  phone_number: string | null
  avatar_url: string | null
  address: string | null
  zalo: string | null
  facebook: string | null
  user_type?: string | null
}

type Owner = {
  id: number
  username: string
  email: string | null
  profile?: OwnerProfile | null
}

type RoomDetail = {
  id: number
  title: string
  address: string | null
  price: number | string
  area: number | string | null
  description: string | null
  booking_status: string
  created_at: string | null

  category?: NamedEntity | null
  postType?: { id: number; name: string; code?: string } | null
  post_type?: { id: number; name: string; code?: string } | null
  city?: NamedEntity | null
  district?: NamedEntity | null
  ward?: NamedEntity | null

  photos?: RoomPhoto[] | null
  owner?: Owner | null
  owner_user_id?: number
}

type CreateContactPayload = {
  name: string
  email?: string | null
  phone?: string | null
  subject?: string | null
  message: string
  room_id?: number | null
  owner_user_id?: number | null
}

// -------------------- Router --------------------
const route = useRoute()
const router = useRouter()

const roomIdNum = computed(() => {
  const n = Number(route.params.id)
  return Number.isFinite(n) ? n : 0
})

const roomQuery = useRoomDetailsQuery(roomIdNum.value)

const roomDetails = computed(
  () => roomQuery.data.value as RoomDetail | undefined,
)
const isLoading = computed(() => roomQuery.isLoading.value)
const isError = computed(() => roomQuery.isError.value)

// -------------------- Helpers --------------------
const formatMoneyVND = (value: number | string) => {
  const n = Number(value ?? 0)
  if (Number.isNaN(n)) return String(value ?? '')
  return n.toLocaleString('vi-VN') + ' ₫'
}

const formatDateTime = (iso: string | null) => {
  if (!iso) return ''
  const d = new Date(iso)
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d)
}

const statusLabel = (s: string) => {
  const v = (s || '').toLowerCase()
  if (v === 'available') return 'Còn trống'
  if (v === 'occupied') return 'Đã thuê'
  if (v === 'pending') return 'Đang có người hỏi'
  if (v === 'confirmed') return 'Đã xác nhận'
  return s
}

const statusVariant = (s: string) => {
  const v = (s || '').toLowerCase()
  if (v === 'available') return 'default'
  if (v === 'pending') return 'secondary'
  if (v === 'occupied' || v === 'confirmed') return 'destructive'
  return 'secondary'
}

const isUnavailable = (s: string) => {
  const v = (s || '').toLowerCase()
  return v === 'occupied' || v === 'confirmed'
}

// -------------------- Photos --------------------
const activePhoto = ref<string>('')

const photosSorted = computed(() => {
  const photos = roomDetails.value?.photos ?? []
  return [...photos]
    .filter((p) => !!p.photo_url)
    .sort((a, b) => {
      if (a.is_cover && !b.is_cover) return -1
      if (!a.is_cover && b.is_cover) return 1
      return (a.sort_order ?? 999) - (b.sort_order ?? 999)
    })
})

const coverPhoto = computed(() => {
  return (
    photosSorted.value.find((p) => p.is_cover)?.photo_url ||
    photosSorted.value[0]?.photo_url ||
    ''
  )
})

watchEffect(() => {
  if (!activePhoto.value && coverPhoto.value)
    activePhoto.value = coverPhoto.value
})

// -------------------- Computed display --------------------
const locationText = computed(() => {
  const r = roomDetails.value
  if (!r) return '—'
  const parts = [r.ward?.name, r.district?.name, r.city?.name].filter(Boolean)
  return parts.length ? parts.join(', ') : '—'
})

const postTypeText = computed(() => {
  const r = roomDetails.value
  const p = r?.postType ?? r?.post_type
  if (!p?.name) return null
  return p.code ? `${p.name} (${p.code})` : p.name
})

const ownerName = computed(() => {
  const o = roomDetails.value?.owner
  return o?.profile?.full_name || o?.username || '—'
})

const ownerPhone = computed(() => {
  return roomDetails.value?.owner?.profile?.phone_number || ''
})

const callPhoneHref = computed(() => {
  if (!ownerPhone.value) return ''
  return `tel:${ownerPhone.value.replace(/\s+/g, '')}`
})

const zaloHref = computed(() => {
  const zalo = roomDetails.value?.owner?.profile?.zalo
  if (!zalo) return ''
  return `https://zalo.me/${zalo.replace(/\s+/g, '')}`
})

// -------------------- Contact dialog + mutation --------------------
const openContact = ref(false)

const contactMutation = useContactMutaion()

const handleContactSubmit = (v: ContactFormValues) => {
  const room = roomDetails.value
  if (!room) return

  const composedMessage = [
    `Phòng: #${room.id} - ${room.title}`,
    room.address ? `Địa chỉ: ${room.address}` : null,
    `Khu vực: ${locationText.value}`,
    `Ngày dự kiến dọn vào: ${v.moveInDate}`,
    v.message ? `Ghi chú: ${v.message}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  console.log('Submitting contact form with data:', {
    id: String(room.id),
    formData: {
      name: v.name,
      phone: v.phone,
      email: v.email,
      moveInDate: v.moveInDate,
      message: composedMessage,
    },
  })

  contactMutation.mutate({
    id: String(room.id),
    formData: {
      name: v.name,
      phone: v.phone,
      email: v.email,
      moveInDate: v.moveInDate,
      message: composedMessage,
    },
  })
}

watch(
  () => contactMutation.isSuccess.value,
  (ok) => {
    if (ok) openContact.value = false
  },
)
</script>

<template>
  <div class="mx-auto w-full max-w-6xl px-4 py-8">
    <!-- Header bar -->
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
        <div class="text-sm text-muted-foreground">Room #{{ roomIdNum }}</div>
      </div>

      <div class="flex items-center gap-2">
        <Badge
          v-if="roomDetails?.booking_status"
          :variant="statusVariant(roomDetails.booking_status) as any"
          class="capitalize"
        >
          {{ statusLabel(roomDetails.booking_status) }}
        </Badge>

        <Badge
          v-if="postTypeText"
          variant="secondary"
          >{{ postTypeText }}</Badge
        >
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="isLoading"
      class="grid grid-cols-1 gap-6 lg:grid-cols-12"
    >
      <div class="lg:col-span-7">
        <Card
          class="overflow-hidden rounded-2xl border-border/60 bg-card/80 shadow-sm"
        >
          <div class="relative aspect-4/3 bg-muted">
            <Skeleton class="h-full w-full" />
          </div>
          <CardContent class="p-4">
            <Skeleton class="h-4 w-2/3" />
            <div class="mt-3 flex gap-2">
              <Skeleton class="h-20 w-28 rounded-xl" />
              <Skeleton class="h-20 w-28 rounded-xl" />
              <Skeleton class="h-20 w-28 rounded-xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="lg:col-span-5 space-y-6">
        <Card class="rounded-2xl border-border/60 bg-card/80 shadow-sm">
          <CardHeader class="pb-2"
            ><CardTitle class="text-base"
              >Thông tin phòng</CardTitle
            ></CardHeader
          >
          <CardContent class="space-y-3">
            <Skeleton class="h-20 w-full rounded-xl" />
            <Skeleton class="h-20 w-full rounded-xl" />
            <Skeleton class="h-10 w-full rounded-xl" />
          </CardContent>
        </Card>

        <Card class="rounded-2xl border-border/60 bg-card/80 shadow-sm">
          <CardHeader class="pb-2"
            ><CardTitle class="text-base">Mô tả</CardTitle></CardHeader
          >
          <CardContent><Skeleton class="h-24 w-full" /></CardContent>
        </Card>
      </div>
    </div>

    <!-- Error -->
    <div
      v-else-if="isError"
      class="rounded-2xl border border-border/60 bg-card/60 p-6"
    >
      Không tải được dữ liệu phòng. Vui lòng thử lại.
      <div class="mt-3">
        <Button
          variant="secondary"
          class="rounded-xl"
          @click="roomQuery.refetch()"
        >
          Tải lại
        </Button>
      </div>
    </div>

    <!-- Content -->
    <div
      v-else-if="roomDetails"
      class="grid grid-cols-1 gap-6 lg:grid-cols-12"
    >
      <!-- Left: gallery -->
      <div class="lg:col-span-7">
        <Card
          class="overflow-hidden rounded-2xl border-border/60 bg-card/80 shadow-sm"
        >
          <div class="relative aspect-4/3 bg-muted">
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
                  {{ roomDetails.title }}
                </div>
                <div class="truncate text-sm text-white/80">
                  {{ roomDetails.address }}
                </div>
              </div>

              <div class="shrink-0 rounded-xl bg-black/55 px-3 py-2 text-right">
                <div class="text-sm font-semibold text-white">
                  {{ formatMoneyVND(roomDetails.price) }}
                </div>
                <div class="text-xs text-white/80">
                  {{ roomDetails.area ?? '—' }} m²
                </div>
              </div>
            </div>
          </div>

          <CardContent class="p-4">
            <div class="flex items-center justify-between">
              <div class="text-sm text-muted-foreground">
                Đăng: {{ formatDateTime(roomDetails.created_at) }}
              </div>

              <Button
                variant="secondary"
                class="rounded-xl"
                :disabled="isUnavailable(roomDetails.booking_status)"
                @click="openContact = true"
              >
                Gửi yêu cầu
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
                  @click="activePhoto = p.photo_url || ''"
                >
                  <img
                    :src="p.photo_url || ''"
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

      <!-- Right: info -->
      <div class="lg:col-span-5 space-y-6">
        <Card class="rounded-2xl border-border/60 bg-card/80 shadow-sm">
          <CardHeader class="pb-2"
            ><CardTitle class="text-base"
              >Thông tin phòng</CardTitle
            ></CardHeader
          >
          <CardContent class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div
                class="rounded-xl border border-border/60 bg-background/40 p-3"
              >
                <div class="text-xs text-muted-foreground">Giá</div>
                <div class="mt-1 text-sm font-semibold">
                  {{ formatMoneyVND(roomDetails.price) }}
                </div>
              </div>

              <div
                class="rounded-xl border border-border/60 bg-background/40 p-3"
              >
                <div class="text-xs text-muted-foreground">Diện tích</div>
                <div class="mt-1 text-sm font-semibold">
                  {{ roomDetails.area ?? '—' }} m²
                </div>
              </div>

              <div
                class="rounded-xl border border-border/60 bg-background/40 p-3"
              >
                <div class="text-xs text-muted-foreground">Trạng thái</div>
                <div class="mt-1 text-sm font-semibold">
                  {{ statusLabel(roomDetails.booking_status) }}
                </div>
              </div>

              <div
                class="rounded-xl border border-border/60 bg-background/40 p-3"
              >
                <div class="text-xs text-muted-foreground">Mã phòng</div>
                <div class="mt-1 text-sm font-semibold">
                  #{{ roomDetails.id }}
                </div>
              </div>
            </div>

            <div
              class="rounded-xl border border-border/60 bg-background/40 p-3"
            >
              <div class="text-xs text-muted-foreground">Khu vực</div>
              <div class="mt-1 text-sm">{{ locationText }}</div>
            </div>

            <div
              class="rounded-xl border border-border/60 bg-background/40 p-3"
            >
              <div class="text-xs text-muted-foreground">Danh mục</div>
              <div class="mt-1 text-sm font-medium">
                {{ roomDetails.category?.name ?? '—' }}
              </div>
            </div>

            <Button
              class="w-full rounded-xl"
              size="lg"
              :disabled="isUnavailable(roomDetails.booking_status)"
              @click="openContact = true"
            >
              Liên hệ chủ trọ
            </Button>
          </CardContent>
        </Card>

        <Card class="rounded-2xl border-border/60 bg-card/80 shadow-sm">
          <CardHeader class="pb-2"
            ><CardTitle class="text-base">Mô tả</CardTitle></CardHeader
          >
          <CardContent>
            <p
              class="whitespace-pre-line text-sm leading-relaxed text-foreground/90"
            >
              {{ roomDetails.description || 'Không có mô tả.' }}
            </p>
          </CardContent>
        </Card>

        <Card class="rounded-2xl border-border/60 bg-card/80 shadow-sm">
          <CardHeader class="pb-2"
            ><CardTitle class="text-base"
              >Thông tin liên hệ</CardTitle
            ></CardHeader
          >
          <CardContent class="space-y-3">
            <div
              class="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3"
            >
              <div class="min-w-0">
                <div class="text-xs text-muted-foreground">Chủ trọ</div>
                <div class="mt-1 truncate text-sm font-semibold">
                  {{ ownerName }}
                </div>
                <div class="mt-1 text-xs text-muted-foreground">
                  {{ ownerPhone || 'Chưa có số điện thoại' }}
                </div>
              </div>
              <Badge variant="secondary">{{
                roomDetails.owner?.email ? 'Email OK' : 'Chưa có email'
              }}</Badge>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <a
                v-if="callPhoneHref"
                :href="callPhoneHref"
                class="block"
              >
                <Button
                  variant="secondary"
                  class="w-full rounded-xl"
                  >Gọi điện</Button
                >
              </a>
              <Button
                v-else
                variant="secondary"
                class="w-full rounded-xl"
                disabled
                >Gọi điện</Button
              >

              <a
                v-if="zaloHref"
                :href="zaloHref"
                target="_blank"
                rel="noreferrer"
                class="block"
              >
                <Button
                  variant="outline"
                  class="w-full rounded-xl"
                  >Chat Zalo</Button
                >
              </a>
              <Button
                v-else
                variant="outline"
                class="w-full rounded-xl"
                disabled
                >Chat Zalo</Button
              >
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <RoomContactDialog
      v-model="openContact"
      :room-title="roomDetails?.title"
      :room-price="roomDetails?.price"
      :format-money="formatMoneyVND"
      :is-pending="contactMutation.isPending.value"
      :is-error="contactMutation.isError.value"
      :on-submit="handleContactSubmit"
    />
  </div>
</template>
