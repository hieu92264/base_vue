<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { LandlordService } from '@/services/landlord.service'
import { useQuery } from '@tanstack/vue-query'
import {
  CircleCheckBig,
  CircleDashed,
  CircleOff,
  DollarSign,
  House,
  Home,
  RefreshCcw,
} from 'lucide-vue-next'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ['landlord_dashboard'],
  queryFn: LandlordService.dashboard,
})

const summary = computed(() => {
  return (
    data.value?.summary ?? {
      total_rooms: 0,
      active_rooms: 0,
      inactive_rooms: 0,
      available_rooms: 0,
      occupied_rooms: 0,
      pending_rooms: 0,
      total_value: 0,
    }
  )
})

const latestRooms = computed(() => data.value?.latest_rooms ?? [])

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

const formatMoney = (value?: number) => {
  return new Intl.NumberFormat('vi-VN').format(Number(value ?? 0))
}

const roomImage = (room: any) => {
  return (
    room?.photos?.find((p: any) => p.is_cover)?.photo_url ||
    room?.photos?.[0]?.photo_url ||
    'https://placehold.co/600x400?text=Khong+co+anh'
  )
}
</script>

<template>
  <div class="flex-1 space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">Dashboard chủ nhà</h2>
        <p class="text-muted-foreground">
          Tổng quan dữ liệu thực tế từ các tin đăng của bạn
        </p>
      </div>

      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          :disabled="isFetching"
          @click="refetch()"
        >
          <RefreshCcw
            class="mr-2 h-4 w-4"
            :class="{ 'animate-spin': isFetching }"
          />
          Làm mới
        </Button>

        <Button @click="router.push({ name: 'landlord.my-rooms' })">
          Quản lý tin đăng
        </Button>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Tổng số tin</CardTitle>
          <House class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton
            v-if="isLoading"
            class="h-8 w-20"
          />
          <div
            v-else
            class="text-2xl font-bold"
          >
            {{ summary.total_rooms }}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Tin đang hoạt động</CardTitle>
          <CircleCheckBig class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton
            v-if="isLoading"
            class="h-8 w-20"
          />
          <div
            v-else
            class="text-2xl font-bold"
          >
            {{ summary.active_rooms }}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Phòng còn trống</CardTitle>
          <Home class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton
            v-if="isLoading"
            class="h-8 w-20"
          />
          <div
            v-else
            class="text-2xl font-bold"
          >
            {{ summary.available_rooms }}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium"
            >Tổng giá trị niêm yết</CardTitle
          >
          <DollarSign class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton
            v-if="isLoading"
            class="h-8 w-36"
          />
          <div
            v-else
            class="text-2xl font-bold"
          >
            {{ formatMoney(summary.total_value) }} đ
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <Card class="lg:col-span-1">
        <CardHeader>
          <CardTitle>Thống kê nhanh</CardTitle>
          <CardDescription>Trạng thái tin đăng của bạn</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">Đang hoạt động</span>
            <Badge>{{ summary.active_rooms }}</Badge>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">Tạm ẩn</span>
            <Badge variant="secondary">{{ summary.inactive_rooms }}</Badge>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">Còn trống</span>
            <Badge>{{ summary.available_rooms }}</Badge>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">Đã thuê</span>
            <Badge>{{ summary.occupied_rooms }}</Badge>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">Chờ xử lý</span>
            <Badge variant="outline">{{ summary.pending_rooms }}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle>Tin đăng gần đây</CardTitle>
          <CardDescription>5 tin mới nhất của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            v-if="isLoading"
            class="space-y-3"
          >
            <Skeleton class="h-20 w-full" />
            <Skeleton class="h-20 w-full" />
            <Skeleton class="h-20 w-full" />
          </div>

          <div
            v-else-if="latestRooms.length === 0"
            class="text-sm text-muted-foreground"
          >
            Bạn chưa có tin đăng nào.
          </div>

          <div
            v-else
            class="space-y-4"
          >
            <div
              v-for="room in latestRooms"
              :key="room.id"
              class="flex gap-4 rounded-lg border p-3"
            >
              <img
                :src="roomImage(room)"
                :alt="room.title"
                class="h-20 w-28 rounded-md object-cover border"
              />

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <h4 class="font-semibold line-clamp-1">{{ room.title }}</h4>
                    <p class="text-sm text-muted-foreground line-clamp-1">
                      {{ room.address || 'Chưa cập nhật địa chỉ' }}
                    </p>
                  </div>
                  <Badge variant="outline">{{
                    statusLabel(room.booking_status)
                  }}</Badge>
                </div>

                <Separator class="my-2" />

                <div class="flex flex-wrap items-center gap-4 text-sm">
                  <span><b>Giá:</b> {{ formatMoney(room.price) }} đ</span>
                  <span><b>Diện tích:</b> {{ room.area || 0 }} m²</span>
                  <span><b>Mã tin:</b> #{{ room.id }}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
