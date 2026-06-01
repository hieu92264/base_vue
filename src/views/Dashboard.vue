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
  DollarSign,
  House,
  Home,
  RefreshCcw,
} from 'lucide-vue-next'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t, locale } = useI18n()

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
      return t('status.room.available')
    case 'occupied':
      return t('status.room.occupied')
    case 'confirmed':
      return t('status.room.confirmed')
    default:
      return t('status.room.pending')
  }
}

const formatMoney = (value?: number) => {
  const numberLocale = locale.value === 'vi' ? 'vi-VN' : 'en-US'
  return new Intl.NumberFormat(numberLocale).format(Number(value ?? 0))
}

const roomImage = (room: any) => {
  return (
    room?.photos?.find((p: any) => p.is_cover)?.photo_url ||
    room?.photos?.[0]?.photo_url ||
    `https://placehold.co/600x400?text=${t('pages.landlordDashboard.roomImageFallback')}`
  )
}
</script>

<template>
  <div class="flex-1 space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">
          {{ t('pages.landlordDashboard.title') }}
        </h2>
        <p class="text-muted-foreground">
          {{ t('pages.landlordDashboard.description') }}
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
          {{ t('common.refresh') }}
        </Button>

        <Button @click="router.push({ name: 'landlord.my-rooms' })">
          {{ t('pages.landlordDashboard.manageRooms') }}
        </Button>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">{{
            t('pages.landlordDashboard.totalRooms')
          }}</CardTitle>
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
          <CardTitle class="text-sm font-medium">{{
            t('pages.landlordDashboard.activeRooms')
          }}</CardTitle>
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
          <CardTitle class="text-sm font-medium">{{
            t('pages.landlordDashboard.availableRooms')
          }}</CardTitle>
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
          <CardTitle class="text-sm font-medium">{{
            t('pages.landlordDashboard.totalValue')
          }}</CardTitle>
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
            {{ formatMoney(summary.total_value) }}
            {{ t('pages.landlordDashboard.currencySuffix') }}
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <Card class="lg:col-span-1">
        <CardHeader>
          <CardTitle>{{ t('pages.landlordDashboard.quickStats') }}</CardTitle>
          <CardDescription>{{
            t('pages.landlordDashboard.quickStatsDescription')
          }}</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">{{
              t('pages.landlordDashboard.activeRooms')
            }}</span>
            <Badge>{{ summary.active_rooms }}</Badge>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">{{
              t('pages.landlordDashboard.inactiveRooms')
            }}</span>
            <Badge variant="secondary">{{ summary.inactive_rooms }}</Badge>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">{{
              t('pages.landlordDashboard.availableRooms')
            }}</span>
            <Badge>{{ summary.available_rooms }}</Badge>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">{{
              t('pages.landlordDashboard.occupiedRooms')
            }}</span>
            <Badge>{{ summary.occupied_rooms }}</Badge>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">{{
              t('pages.landlordDashboard.pendingRooms')
            }}</span>
            <Badge variant="outline">{{ summary.pending_rooms }}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle>{{ t('pages.landlordDashboard.recentRooms') }}</CardTitle>
          <CardDescription>{{
            t('pages.landlordDashboard.recentRoomsDescription')
          }}</CardDescription>
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
            {{ t('pages.landlordDashboard.emptyRooms') }}
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
                      {{
                        room.address || t('pages.landlordDashboard.addressFallback')
                      }}
                    </p>
                  </div>
                  <Badge variant="outline">{{
                    statusLabel(room.booking_status)
                  }}</Badge>
                </div>

                <Separator class="my-2" />

                <div class="flex flex-wrap items-center gap-4 text-sm">
                  <span
                    ><b>{{ t('pages.landlordDashboard.price') }}:</b>
                    {{ formatMoney(room.price) }}
                    {{ t('pages.landlordDashboard.currencySuffix') }}</span
                  >
                  <span
                    ><b>{{ t('pages.landlordDashboard.area') }}:</b>
                    {{ room.area || 0 }} m²</span
                  >
                  <span
                    ><b>{{ t('pages.landlordDashboard.listingCode') }}:</b>
                    #{{ room.id }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
