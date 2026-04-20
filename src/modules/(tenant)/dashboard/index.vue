<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import {
  Search,
  Phone,
  Mail,
  CalendarDays,
  Home,
  Handshake,
} from 'lucide-vue-next'

import { ContactService } from '@/services/contact.service'
import { DealService } from '@/services/deal.service'
import type { IContact, IDeal } from '@/common/types/entities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useI18n } from 'vue-i18n'

const filters = ref({
  keyword: '',
  page: 1,
  per_page: 10,
})

const { t, locale } = useI18n()

const params = computed(() => ({
  keyword: filters.value.keyword || undefined,
  page: filters.value.page,
  per_page: filters.value.per_page,
}))

const contactsQuery = useQuery({
  queryKey: computed(() => ['tenant_contacts_dashboard', params.value]),
  queryFn: () => ContactService.getTenantContacts(params.value),
})

const dealsQuery = useQuery({
  queryKey: computed(() => ['tenant_deals_dashboard', params.value]),
  queryFn: () => DealService.getTenantDeals(params.value),
})

const contacts = computed<IContact[]>(
  () => contactsQuery.data.value?.data ?? [],
)
const deals = computed<IDeal[]>(() => dealsQuery.data.value?.data ?? [])

const statusLabel = (value?: string) => {
  const status = String(value ?? '')

  if (
    [
      'draft',
      'reserved',
      'confirmed',
      'cancelled',
      'completed',
    ].includes(status)
  ) {
    return t(`status.deal.${status}` as any)
  }

  if (
    [
      'new',
      'contacted',
      'viewing_scheduled',
      'viewed',
      'negotiating',
      'waiting_decision',
      'won',
      'lost',
      'cancelled',
    ].includes(status)
  ) {
    return t(`status.lead.${status}` as any)
  }

  return value || t('status.unknown')
}

const badgeVariant = (value?: string) => {
  if (['won', 'confirmed', 'completed'].includes(String(value)))
    return 'default'
  if (['lost', 'cancelled'].includes(String(value))) return 'destructive'
  if (['reserved', 'contacted', 'viewed'].includes(String(value)))
    return 'secondary'
  return 'outline'
}

const roomAvailabilityLabel = (value?: string) => {
  const status = String(value ?? '')

  if (
    ['available', 'reserved', 'occupied', 'hidden', 'pending', 'confirmed'].includes(
      status,
    )
  ) {
    return t(`status.room.${status}` as any)
  }

  return value || t('status.unknownShort')
}

const formatDateTime = (value?: string | null) => {
  if (!value) return t('pages.tenantDashboard.emptyValue')
  const dateLocale = locale.value === 'vi' ? 'vi-VN' : 'en-US'
  return new Date(value).toLocaleString(dateLocale)
}

const formatCurrency = (value?: string | number) => {
  const numberLocale = locale.value === 'vi' ? 'vi-VN' : 'en-US'
  return new Intl.NumberFormat(numberLocale).format(Number(value ?? 0))
}

const applyFilters = () => {
  filters.value.page = 1
  contactsQuery.refetch()
  dealsQuery.refetch()
}
</script>

<template>
  <div class="space-y-6 px-4 py-4 md:px-6">
    <div>
      <h2 class="text-2xl font-bold tracking-tight">
        {{ t('pages.tenantDashboard.title') }}
      </h2>
      <p class="text-sm text-muted-foreground">
        {{ t('pages.tenantDashboard.description') }}
      </p>
    </div>

    <Card class="border-border/70">
      <CardContent class="grid grid-cols-1 gap-3 p-4 md:grid-cols-[1fr_auto]">
        <div class="relative">
          <Search
            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            v-model="filters.keyword"
            class="pl-9"
            :placeholder="t('pages.tenantDashboard.searchPlaceholder')"
            @keyup.enter="applyFilters"
          />
        </div>
        <Button
          class="rounded-xl"
          @click="applyFilters"
          >{{ t('common.search') }}</Button
        >
      </CardContent>
    </Card>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <Card class="border-border/70">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-base">
            <Mail class="h-4 w-4" />
            {{ t('pages.tenantDashboard.sentContacts') }}
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div
            v-if="contactsQuery.isLoading.value"
            class="text-sm text-muted-foreground"
          >
            {{ t('pages.tenantDashboard.loadingContacts') }}
          </div>
          <div
            v-else-if="!contacts.length"
            class="text-sm text-muted-foreground"
          >
            {{ t('pages.tenantDashboard.emptyContacts') }}
          </div>
          <div
            v-for="contact in contacts"
            :key="contact.id"
            class="rounded-2xl border border-border/70 p-4"
          >
            <div
              class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"
            >
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <Home class="h-4 w-4 text-muted-foreground" />
                  <div class="font-semibold">
                    {{
                      contact.room_title || t('pages.tenantDashboard.roomUpdating')
                    }}
                  </div>
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ contact.room_address || t('pages.tenantDashboard.noAddress') }}
                </div>
                <div class="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span class="inline-flex items-center gap-1"
                    ><Phone class="h-3.5 w-3.5" />
                    {{
                      contact.owner_phone ||
                      t('pages.tenantDashboard.noOwnerPhone')
                    }}</span
                  >
                  <span class="inline-flex items-center gap-1"
                    ><CalendarDays class="h-3.5 w-3.5" />
                    {{ t('pages.tenantDashboard.moveInDate') }}:
                    {{
                      contact.move_in_date ||
                      t('pages.tenantDashboard.notSelected')
                    }}</span
                  >
                </div>
              </div>
              <div class="flex flex-col items-start gap-2 md:items-end">
                <Badge :variant="badgeVariant(contact.status) as any">{{
                  statusLabel(contact.status)
                }}</Badge>
                <div class="text-xs text-muted-foreground">
                  {{ t('pages.tenantDashboard.sentAt') }}:
                  {{ formatDateTime(contact.created_at) }}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-border/70">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-base">
            <Handshake class="h-4 w-4" />
            {{ t('pages.tenantDashboard.rentalStatus') }}
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div
            v-if="dealsQuery.isLoading.value"
            class="text-sm text-muted-foreground"
          >
            {{ t('pages.tenantDashboard.loadingDeals') }}
          </div>
          <div
            v-else-if="!deals.length"
            class="text-sm text-muted-foreground"
          >
            {{ t('pages.tenantDashboard.emptyDeals') }}
          </div>
          <div
            v-for="deal in deals"
            :key="deal.id"
            class="rounded-2xl border border-border/70 p-4"
          >
            <div
              class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"
            >
              <div class="space-y-2">
                <div class="font-semibold">
                  {{ deal.room_title || t('pages.tenantDashboard.roomUpdating') }}
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ deal.room_address || t('pages.tenantDashboard.noAddress') }}
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ t('pages.tenantDashboard.agreedPrice') }}:
                  {{ formatCurrency(deal.agreed_price) }}
                  {{ deal.currency || t('pages.tenantDashboard.currency') }}
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ t('pages.tenantDashboard.roomStatus') }}:
                  <span class="font-medium text-foreground">{{
                    roomAvailabilityLabel(
                      deal.room_availability_status ?? undefined,
                    )
                  }}</span>
                </div>
              </div>
              <div class="flex flex-col items-start gap-2 md:items-end">
                <Badge :variant="badgeVariant(deal.status ?? undefined) as any">{{
                  statusLabel(deal.status ?? undefined)
                }}</Badge>
                <div class="text-xs text-muted-foreground">
                  {{ t('pages.tenantDashboard.rentalStart') }}:
                  {{ deal.start_date || t('pages.tenantDashboard.notFinalized') }}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
