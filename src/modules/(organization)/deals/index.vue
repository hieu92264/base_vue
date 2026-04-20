<script setup lang="ts">
import type { IContact, IDeal } from '@/common/types/entities'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ContactService } from '@/services/contact.service'
import { DealService, type DealStatus } from '@/services/deal.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { FileText, Handshake, Home, Search, UserRound } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'

const { t } = useI18n()
const route = useRoute()
const queryClient = useQueryClient()

const dealStatusOptions = computed((): { value: DealStatus; label: string }[] => [
  { value: 'draft', label: t('status.deal.draft') },
  { value: 'reserved', label: t('status.deal.reserved') },
  { value: 'confirmed', label: t('status.deal.confirmed') },
  { value: 'cancelled', label: t('status.deal.cancelled') },
  { value: 'completed', label: t('status.deal.completed') },
])

const filters = ref({
  keyword: '',
  status: 'all',
  page: 1,
  per_page: 12,
})

const params = computed(() => ({
  keyword: filters.value.keyword || undefined,
  status: filters.value.status !== 'all' ? filters.value.status : undefined,
  page: filters.value.page,
  per_page: filters.value.per_page,
}))

const dealsQuery = useQuery({
  queryKey: computed(() => ['admin_deals_page', params.value]),
  queryFn: () => DealService.getAdminDeals(params.value),
})

const wonLeadsQuery = useQuery({
  queryKey: ['admin_won_leads_for_deals'],
  queryFn: () =>
    ContactService.getAdminContacts({
      status: 'won',
      page: 1,
      per_page: 100,
    }),
})

const deals = computed<IDeal[]>(() => dealsQuery.data.value?.data ?? [])
const wonLeads = computed<IContact[]>(() => wonLeadsQuery.data.value?.data ?? [])
const meta = computed(() => dealsQuery.data.value?.meta)

const selectedId = ref<number | null>(null)

watch(
  deals,
  (rows) => {
    if (!rows.length) {
      selectedId.value = null
      return
    }
    if (!rows.some((item) => item.id === selectedId.value)) {
      selectedId.value = rows[0]?.id ?? null
    }
  },
  { immediate: true },
)

const selectedDeal = computed<IDeal | null>(() => {
  return deals.value.find((item) => item.id === selectedId.value) ?? null
})

const statusLabel = (value?: string) => {
  return (
    dealStatusOptions.value.find((item) => item.value === value)?.label ??
    t('status.unknown')
  )
}

const statusVariant = (value?: string) => {
  switch (value) {
    case 'confirmed':
    case 'completed':
      return 'default'
    case 'cancelled':
      return 'destructive'
    case 'reserved':
      return 'secondary'
    default:
      return 'outline'
  }
}

const form = ref({
  room_id: '',
  contact_id: '',
  agreed_price: '',
  start_date: '',
  tenant_name: '',
  tenant_phone: '',
  tenant_email: '',
  note: '',
})

const selectedWonLead = computed(() => {
  return (
    wonLeads.value.find(
      (item) => String(item.id) === String(form.value.contact_id),
    ) ?? null
  )
})

watch(
  () => form.value.contact_id,
  (id) => {
    const lead = wonLeads.value.find((item) => String(item.id) === String(id))
    if (!lead) return

    form.value.room_id = String(lead.room_id ?? '')
    form.value.tenant_name = lead.name ?? ''
    form.value.tenant_phone = lead.phone ?? ''
    form.value.tenant_email = lead.email ?? ''
  },
  { immediate: true },
)

watch(
  () => route.query,
  (query) => {
    if (query.contact_id) form.value.contact_id = String(query.contact_id)
    if (query.room_id) form.value.room_id = String(query.room_id)
    if (query.tenant_name) form.value.tenant_name = String(query.tenant_name)
    if (query.tenant_phone) form.value.tenant_phone = String(query.tenant_phone)
    if (query.tenant_email) form.value.tenant_email = String(query.tenant_email)
  },
  { immediate: true, deep: true },
)

const createMutation = useMutation({
  mutationFn: () =>
    DealService.createAdminDeal({
      room_id: Number(form.value.room_id),
      contact_id: form.value.contact_id ? Number(form.value.contact_id) : null,
      agreed_price: Number(form.value.agreed_price),
      start_date: form.value.start_date || null,
      tenant_name: form.value.tenant_name || null,
      tenant_phone: form.value.tenant_phone || null,
      tenant_email: form.value.tenant_email || null,
      note: form.value.note || null,
    }),
  onSuccess: () => {
    toast.success(t('pages.organizationDeals.messages.createSuccess'))
    queryClient.invalidateQueries({ queryKey: ['admin_deals_page'] })
    dealsQuery.refetch()
  },
  onError: () => {
    toast.error(t('pages.organizationDeals.messages.createError'))
  },
})

const updateMutation = useMutation({
  mutationFn: (payload: {
    id: number
    status: DealStatus
    note?: string | null
  }) =>
    DealService.updateAdminDeal(payload.id, {
      status: payload.status,
      note: payload.note,
    }),
  onSuccess: () => {
    toast.success(t('pages.organizationDeals.messages.updateSuccess'))
    queryClient.invalidateQueries({ queryKey: ['admin_deals_page'] })
  },
  onError: () => {
    toast.error(t('pages.organizationDeals.messages.updateError'))
  },
})

const applyFilters = () => {
  filters.value.page = 1
  dealsQuery.refetch()
}

const goPrevPage = () => {
  if (filters.value.page <= 1) return
  filters.value.page--
  dealsQuery.refetch()
}

const goNextPage = () => {
  if (!meta.value || filters.value.page >= meta.value.last_page) return
  filters.value.page++
  dealsQuery.refetch()
}

const summary = computed(() => {
  const count = (target: string) =>
    deals.value.filter((item) => item.status === target).length
  return [
    { label: t('pages.organizationDeals.summary.draft'), value: count('draft') },
    {
      label: t('pages.organizationDeals.summary.reserved'),
      value: count('reserved'),
    },
    {
      label: t('pages.organizationDeals.summary.confirmed'),
      value: count('confirmed'),
    },
    {
      label: t('pages.organizationDeals.summary.completed'),
      value: count('completed'),
    },
  ]
})

const roomFallback = (roomId?: number | null) =>
  t('pages.organizationDeals.roomFallback', { id: roomId ?? '-' })
</script>

<template>
  <div class="w-full space-y-5 px-4 py-4 md:px-6">
    <div>
      <h2 class="text-2xl font-bold tracking-tight">
        {{ t('pages.organizationDeals.title') }}
      </h2>
      <p class="text-sm text-muted-foreground">
        {{ t('pages.organizationDeals.description') }}
      </p>
    </div>

    <div class="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <Card
        v-for="item in summary"
        :key="item.label"
        class="w-full border-border/70"
      >
        <CardContent class="p-4">
          <p class="text-xs text-muted-foreground">{{ item.label }}</p>
          <p class="mt-2 text-2xl font-bold">{{ item.value }}</p>
        </CardContent>
      </Card>
    </div>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
      <Card class="w-full min-w-0 border-border/70">
        <CardHeader class="pb-4">
          <CardTitle class="text-base">
            {{ t('pages.organizationDeals.createTitle') }}
          </CardTitle>
        </CardHeader>

        <CardContent class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">
              {{ t('pages.organizationDeals.wonLead') }}
            </label>
            <Select
              :model-value="form.contact_id || 'none'"
              @update:model-value="
                (v) => (form.contact_id = v === 'none' ? '' : String(v))
              "
            >
              <SelectTrigger class="w-full">
                <SelectValue :placeholder="t('pages.organizationDeals.selectWonLead')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{{ t('common.none') }}</SelectItem>
                <SelectItem
                  v-for="lead in wonLeads"
                  :key="lead.id"
                  :value="String(lead.id)"
                >
                  {{ lead.name || t('pages.organizationDeals.guest') }} -
                  {{ lead.room_title || t('common.notAvailable') }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div
            v-if="selectedWonLead"
            class="rounded-xl border bg-muted/30 p-3 text-sm"
          >
            <div>
              <span class="font-medium">{{ t('pages.organizationDeals.room') }}:</span>
              {{ selectedWonLead.room_title || t('common.notAvailable') }}
            </div>
            <div>
              <span class="font-medium">{{ t('pages.organizationDeals.guest') }}:</span>
              {{ selectedWonLead.name || t('common.notAvailable') }}
            </div>
            <div>
              <span class="font-medium">
                {{ t('pages.organizationDeals.tenantPhone') }}:
              </span>
              {{ selectedWonLead.phone || t('common.notAvailable') }}
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">
              {{ t('pages.organizationDeals.roomId') }}
            </label>
            <Input v-model="form.room_id" />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">
              {{ t('pages.organizationDeals.agreedPrice') }}
            </label>
            <Input
              v-model="form.agreed_price"
              type="number"
              min="0"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">
              {{ t('pages.organizationDeals.moveInDate') }}
            </label>
            <Input
              v-model="form.start_date"
              type="date"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">
              {{ t('pages.organizationDeals.tenantName') }}
            </label>
            <Input v-model="form.tenant_name" />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">
              {{ t('pages.organizationDeals.tenantPhone') }}
            </label>
            <Input v-model="form.tenant_phone" />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">
              {{ t('pages.organizationDeals.tenantEmail') }}
            </label>
            <Input v-model="form.tenant_email" />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">
              {{ t('pages.organizationDeals.note') }}
            </label>
            <Textarea
              v-model="form.note"
              rows="4"
            />
          </div>

          <Button
            class="w-full"
            :disabled="
              createMutation.isPending.value ||
              !form.room_id ||
              !form.agreed_price
            "
            @click="createMutation.mutate()"
          >
            {{ t('pages.organizationDeals.createDeal') }}
          </Button>
        </CardContent>
      </Card>

      <div class="min-w-0 space-y-4">
        <Card class="w-full min-w-0 border-border/70">
          <CardHeader class="pb-4">
            <CardTitle class="text-base">
              {{ t('pages.organizationDeals.filtersTitle') }}
            </CardTitle>
          </CardHeader>

          <CardContent
            class="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_180px_140px]"
          >
            <div class="relative min-w-0">
              <Search
                class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                v-model="filters.keyword"
                class="w-full pl-9"
                :placeholder="t('pages.organizationDeals.keywordPlaceholder')"
                @keyup.enter="applyFilters"
              />
            </div>

            <Select
              :model-value="filters.status"
              @update:model-value="(v) => (filters.status = String(v))"
            >
              <SelectTrigger class="w-full">
                <SelectValue :placeholder="t('pages.organizationDeals.statusPlaceholder')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{{ t('common.all') }}</SelectItem>
                <SelectItem
                  v-for="item in dealStatusOptions"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              class="w-full"
              @click="applyFilters"
            >
              {{ t('pages.organizationDeals.applyFilters') }}
            </Button>
          </CardContent>
        </Card>

        <div class="grid grid-cols-1 gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
          <Card class="w-full min-w-0 border-border/70">
            <CardHeader class="pb-4">
              <CardTitle class="text-base">
                {{ t('pages.organizationDeals.listTitle') }}
              </CardTitle>
            </CardHeader>

            <CardContent class="space-y-3">
              <div
                v-if="dealsQuery.isLoading.value"
                class="py-10 text-center text-sm text-muted-foreground"
              >
                {{ t('pages.organizationDeals.loadingData') }}
              </div>

              <div
                v-else-if="deals.length === 0"
                class="py-10 text-center text-sm text-muted-foreground"
              >
                {{ t('pages.organizationDeals.emptyData') }}
              </div>

              <button
                v-for="item in deals"
                :key="item.id"
                type="button"
                class="w-full rounded-xl border p-4 text-left transition hover:border-primary/50"
                :class="
                  selectedId === item.id ? 'border-primary bg-primary/5' : ''
                "
                @click="selectedId = item.id"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <div class="truncate font-semibold">
                      {{ item.room_title || roomFallback(item.room_id) }}
                    </div>
                    <div class="mt-1 truncate text-xs text-muted-foreground">
                      {{
                        item.tenant_name ||
                        item.contact_name ||
                        t('pages.organizationDeals.noTenant')
                      }}
                    </div>
                  </div>

                  <Badge :variant="statusVariant(item.status) as any">
                    {{ statusLabel(item.status) }}
                  </Badge>
                </div>

                <div class="mt-3 space-y-2 text-sm text-muted-foreground">
                  <div class="flex items-center gap-2">
                    <Home class="h-4 w-4 shrink-0" />
                    <span class="truncate">
                      {{ item.room_address || t('common.notAvailable') }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <UserRound class="h-4 w-4 shrink-0" />
                    <span>
                      {{
                        item.tenant_phone ||
                        item.contact_phone ||
                        t('common.notAvailable')
                      }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Handshake class="h-4 w-4 shrink-0" />
                    <span>
                      {{ item.agreed_price || 0 }}
                      {{ item.currency || 'VND' }}
                    </span>
                  </div>
                </div>
              </button>

              <div
                v-if="deals.length > 0"
                class="flex items-center justify-between pt-2"
              >
                <Button
                  variant="outline"
                  :disabled="filters.page <= 1"
                  @click="goPrevPage"
                >
                  {{ t('pages.organizationDeals.previousPage') }}
                </Button>
                <div class="text-sm text-muted-foreground">
                  {{
                    t('pages.organizationDeals.pageText', {
                      current: meta?.current_page || 1,
                      last: meta?.last_page || 1,
                    })
                  }}
                </div>
                <Button
                  variant="outline"
                  :disabled="!meta || filters.page >= meta.last_page"
                  @click="goNextPage"
                >
                  {{ t('pages.organizationDeals.nextPage') }}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card class="w-full min-w-0 border-border/70">
            <CardHeader class="pb-4">
              <CardTitle class="text-base">
                {{ t('pages.organizationDeals.detailsTitle') }}
              </CardTitle>
            </CardHeader>

            <CardContent
              v-if="selectedDeal"
              class="space-y-5"
            >
              <div class="rounded-xl border p-4">
                <div class="mb-3 flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <div class="truncate text-lg font-semibold">
                      {{
                        selectedDeal.room_title ||
                        roomFallback(selectedDeal.room_id)
                      }}
                    </div>
                    <div class="truncate text-sm text-muted-foreground">
                      {{ selectedDeal.room_address || t('common.notAvailable') }}
                    </div>
                  </div>

                  <Badge :variant="statusVariant(selectedDeal.status) as any">
                    {{ statusLabel(selectedDeal.status) }}
                  </Badge>
                </div>

                <div class="grid gap-2 text-sm">
                  <div>
                    <span class="font-medium">
                      {{ t('pages.organizationDeals.guest') }}:
                    </span>
                    {{
                      selectedDeal.tenant_name ||
                      selectedDeal.contact_name ||
                      t('common.notAvailable')
                    }}
                  </div>
                  <div>
                    <span class="font-medium">
                      {{ t('pages.organizationDeals.tenantPhone') }}:
                    </span>
                    {{
                      selectedDeal.tenant_phone ||
                      selectedDeal.contact_phone ||
                      t('common.notAvailable')
                    }}
                  </div>
                  <div>
                    <span class="font-medium">
                      {{ t('pages.organizationDeals.tenantEmail') }}:
                    </span>
                    {{
                      selectedDeal.tenant_email ||
                      selectedDeal.contact_email ||
                      t('common.notAvailable')
                    }}
                  </div>
                  <div>
                    <span class="font-medium">
                      {{ t('pages.organizationDeals.agreedPrice') }}:
                    </span>
                    {{ selectedDeal.agreed_price || 0 }}
                    {{ selectedDeal.currency || 'VND' }}
                  </div>
                  <div>
                    <span class="font-medium">
                      {{ t('pages.organizationDeals.moveInDate') }}:
                    </span>
                    {{ selectedDeal.start_date || t('common.notAvailable') }}
                  </div>
                  <div>
                    <span class="font-medium">
                      {{ t('pages.organizationDeals.roomStatus') }}:
                    </span>
                    {{
                      selectedDeal.room_availability_status ||
                      t('common.notAvailable')
                    }}
                  </div>
                </div>
              </div>

              <div
                v-if="selectedDeal.note"
                class="rounded-xl border p-4"
              >
                <div class="mb-2 flex items-center gap-2 font-medium">
                  <FileText class="h-4 w-4" />
                  {{ t('pages.organizationDeals.noteTitle') }}
                </div>
                <div class="whitespace-pre-wrap text-sm text-muted-foreground">
                  {{ selectedDeal.note }}
                </div>
              </div>

              <div class="space-y-3">
                <div class="text-sm font-medium">
                  {{ t('pages.organizationDeals.updateStatusTitle') }}
                </div>
                <div class="flex flex-wrap gap-2">
                  <Button
                    v-for="item in dealStatusOptions"
                    :key="item.value"
                    variant="outline"
                    :disabled="updateMutation.isPending.value"
                    @click="
                      updateMutation.mutate({
                        id: selectedDeal.id,
                        status: item.value,
                        note: selectedDeal.note || null,
                      })
                    "
                  >
                    {{ item.label }}
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardContent
              v-else
              class="py-10 text-center text-sm text-muted-foreground"
            >
              {{ t('pages.organizationDeals.selectDealPrompt') }}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
