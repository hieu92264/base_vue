<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import {
  Users,
  House,
  MessagesSquare,
  Handshake,
  Star,
  RefreshCcw,
} from 'lucide-vue-next'
import { DashboardService } from '@/services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ['admin_dashboard'],
  queryFn: DashboardService.getAdminDashboard,
})

const summary = computed(() => data.value?.summary)
const latestRooms = computed(() => data.value?.latest_rooms ?? [])
const latestContacts = computed(() => data.value?.latest_contacts ?? [])
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">Dashboard admin</h2>
        <p class="text-muted-foreground">Tổng quan hệ thống</p>
      </div>

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
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader
          ><CardTitle class="text-sm">Người dùng</CardTitle></CardHeader
        >
        <CardContent class="text-2xl font-bold">
          <span v-if="!isLoading">{{ summary?.total_users ?? 0 }}</span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle class="text-sm">Tin đăng</CardTitle></CardHeader>
        <CardContent class="text-2xl font-bold">
          <span v-if="!isLoading">{{ summary?.total_rooms ?? 0 }}</span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle class="text-sm">Lead</CardTitle></CardHeader>
        <CardContent class="text-2xl font-bold">
          <span v-if="!isLoading">{{ summary?.total_contacts ?? 0 }}</span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle class="text-sm">Deal</CardTitle></CardHeader>
        <CardContent class="text-2xl font-bold">
          <span v-if="!isLoading">{{ summary?.total_bookings ?? 0 }}</span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle class="text-sm">Review</CardTitle></CardHeader>
        <CardContent class="text-2xl font-bold">
          <span v-if="!isLoading">{{ summary?.total_reviews ?? 0 }}</span>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Cảnh báo cần xử lý</CardTitle></CardHeader>
        <CardContent class="space-y-3">
          <div class="flex items-center justify-between">
            <span>Tin chờ duyệt</span>
            <Badge>{{ summary?.pending_rooms ?? 0 }}</Badge>
          </div>
          <div class="flex items-center justify-between">
            <span>Lead mới</span>
            <Badge>{{ summary?.new_contacts ?? 0 }}</Badge>
          </div>
          <div class="flex items-center justify-between">
            <span>Review chờ duyệt</span>
            <Badge>{{ summary?.pending_reviews ?? 0 }}</Badge>
          </div>
          <div class="flex items-center justify-between">
            <span>Deal won</span>
            <Badge>{{ summary?.won_bookings ?? 0 }}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Tin gần đây</CardTitle></CardHeader>
        <CardContent class="space-y-3">
          <div
            v-for="room in latestRooms"
            :key="room.id"
            class="rounded-md border p-3"
          >
            <div class="font-medium">{{ room.title }}</div>
            <div class="text-sm text-muted-foreground">
              #{{ room.id }} · {{ room.post_status || 'pending' }}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader><CardTitle>Lead gần đây</CardTitle></CardHeader>
      <CardContent class="space-y-3">
        <div
          v-for="item in latestContacts"
          :key="item.id"
          class="rounded-md border p-3"
        >
          <div class="font-medium">{{ item.name || 'Khách chưa rõ tên' }}</div>
          <div class="text-sm text-muted-foreground">
            {{ item.phone || '---' }} · {{ item.status }}
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
