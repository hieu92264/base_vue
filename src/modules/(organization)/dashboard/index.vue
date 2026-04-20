<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { RefreshCcw } from 'lucide-vue-next'
import { DashboardService } from '@/services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ['admin_dashboard'],
  queryFn: DashboardService.getAdminDashboard,
})

const summary = computed(() => data.value?.summary)
const latestRooms = computed(() => data.value?.latest_rooms ?? [])
const latestContacts = computed(() => data.value?.latest_contacts ?? [])

const roomStatusLabel = (status?: string | null) => {
  const value = String(status ?? '')
  if (['pending', 'hidden', 'occupied', 'confirmed', 'available', 'reserved'].includes(value)) {
    return t(`status.room.${value}` as any)
  }
  return status || t('pages.organizationDashboard.pending')
}

const contactStatusLabel = (status?: string | null) => {
  const value = String(status ?? '')
  if (
    ['new', 'contacted', 'viewing_scheduled', 'viewed', 'negotiating', 'waiting_decision', 'won', 'lost', 'cancelled'].includes(
      value,
    )
  ) {
    return t(`status.lead.${value}` as any)
  }
  return status || t('status.unknown')
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">
          {{ t('pages.organizationDashboard.title') }}
        </h2>
        <p class="text-muted-foreground">
          {{ t('pages.organizationDashboard.description') }}
        </p>
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
        {{ t('common.refresh') }}
      </Button>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader><CardTitle class="text-sm">{{ t('pages.organizationDashboard.users') }}</CardTitle></CardHeader>
        <CardContent class="text-2xl font-bold">
          <span v-if="!isLoading">{{ summary?.total_users ?? 0 }}</span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle class="text-sm">{{ t('pages.organizationDashboard.rooms') }}</CardTitle></CardHeader>
        <CardContent class="text-2xl font-bold">
          <span v-if="!isLoading">{{ summary?.total_rooms ?? 0 }}</span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle class="text-sm">{{ t('pages.organizationDashboard.leads') }}</CardTitle></CardHeader>
        <CardContent class="text-2xl font-bold">
          <span v-if="!isLoading">{{ summary?.total_contacts ?? 0 }}</span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle class="text-sm">{{ t('pages.organizationDashboard.deals') }}</CardTitle></CardHeader>
        <CardContent class="text-2xl font-bold">
          <span v-if="!isLoading">{{ summary?.total_bookings ?? 0 }}</span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle class="text-sm">{{ t('pages.organizationDashboard.reviews') }}</CardTitle></CardHeader>
        <CardContent class="text-2xl font-bold">
          <span v-if="!isLoading">{{ summary?.total_reviews ?? 0 }}</span>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>{{ t('pages.organizationDashboard.alerts') }}</CardTitle></CardHeader>
        <CardContent class="space-y-3">
          <div class="flex items-center justify-between">
            <span>{{ t('pages.organizationDashboard.pendingRooms') }}</span>
            <Badge>{{ summary?.pending_rooms ?? 0 }}</Badge>
          </div>
          <div class="flex items-center justify-between">
            <span>{{ t('pages.organizationDashboard.newLeads') }}</span>
            <Badge>{{ summary?.new_contacts ?? 0 }}</Badge>
          </div>
          <div class="flex items-center justify-between">
            <span>{{ t('pages.organizationDashboard.pendingReviews') }}</span>
            <Badge>{{ summary?.pending_reviews ?? 0 }}</Badge>
          </div>
          <div class="flex items-center justify-between">
            <span>{{ t('pages.organizationDashboard.wonDeals') }}</span>
            <Badge>{{ summary?.won_bookings ?? 0 }}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>{{ t('pages.organizationDashboard.recentRooms') }}</CardTitle></CardHeader>
        <CardContent class="space-y-3">
          <div
            v-for="room in latestRooms"
            :key="room.id"
            class="rounded-md border p-3"
          >
            <div class="font-medium">{{ room.title }}</div>
            <div class="text-sm text-muted-foreground">
              #{{ room.id }} · {{ roomStatusLabel(room.post_status) }}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader><CardTitle>{{ t('pages.organizationDashboard.recentLeads') }}</CardTitle></CardHeader>
      <CardContent class="space-y-3">
        <div
          v-for="item in latestContacts"
          :key="item.id"
          class="rounded-md border p-3"
        >
          <div class="font-medium">
            {{ item.name || t('pages.organizationDashboard.unknownGuest') }}
          </div>
          <div class="text-sm text-muted-foreground">
            {{ item.phone || t('pages.organizationDashboard.emptyPhone') }} ·
            {{ contactStatusLabel(item.status) }}
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
