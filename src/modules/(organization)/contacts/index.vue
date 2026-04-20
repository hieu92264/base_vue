<script setup lang="ts">
import type { IContact } from '@/common/types/entities'
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
import { ContactService, type LeadStatus } from '@/services/contact.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  CalendarDays,
  Handshake,
  Mail,
  Phone,
  Search,
} from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const { t } = useI18n()
const router = useRouter()
const queryClient = useQueryClient()

const statusOptions = computed((): { value: LeadStatus; label: string }[] => [
  { value: 'new', label: t('status.lead.new') },
  { value: 'contacted', label: t('status.lead.contacted') },
  { value: 'viewing_scheduled', label: t('status.lead.viewing_scheduled') },
  { value: 'viewed', label: t('status.lead.viewed') },
  { value: 'negotiating', label: t('status.lead.negotiating') },
  { value: 'waiting_decision', label: t('status.lead.waiting_decision') },
  { value: 'won', label: t('status.lead.won') },
  { value: 'lost', label: t('status.lead.lost') },
  { value: 'cancelled', label: t('status.lead.cancelled') },
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

const contactsQuery = useQuery({
  queryKey: computed(() => ['admin_contacts_pipeline', params.value]),
  queryFn: () => ContactService.getAdminContacts(params.value),
})

const contacts = computed<IContact[]>(() => contactsQuery.data.value?.data ?? [])
const meta = computed(() => contactsQuery.data.value?.meta)

const selectedId = ref<number | null>(null)

watch(
  contacts,
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

const selectedContact = computed<IContact | null>(() => {
  return contacts.value.find((item) => item.id === selectedId.value) ?? null
})

const status = ref<LeadStatus>('new')
const statusNote = ref('')
const lostReason = ref('')
const nextFollowUpAt = ref('')
const viewingAt = ref('')

const toDateTimeLocal = (value?: string | null) => {
  if (!value) return ''
  return String(value).replace(' ', 'T').slice(0, 16)
}

watch(
  selectedContact,
  (row) => {
    status.value = row?.status ?? 'new'
    statusNote.value = row?.status_note ?? ''
    lostReason.value = row?.lost_reason ?? ''
    nextFollowUpAt.value = toDateTimeLocal(row?.next_follow_up_at)
    viewingAt.value = toDateTimeLocal(row?.viewing_at)
  },
  { immediate: true },
)

const summary = computed(() => {
  const count = (target: string) =>
    contacts.value.filter((item) => item.status === target).length

  return [
    { label: t('pages.organizationContacts.summary.new'), value: count('new') },
    {
      label: t('pages.organizationContacts.summary.contacted'),
      value: count('contacted'),
    },
    {
      label: t('pages.organizationContacts.summary.viewing'),
      value: count('viewing_scheduled'),
    },
    {
      label: t('pages.organizationContacts.summary.negotiating'),
      value: count('negotiating'),
    },
    { label: t('pages.organizationContacts.summary.won'), value: count('won') },
    { label: t('pages.organizationContacts.summary.lost'), value: count('lost') },
  ]
})

const statusLabel = (value?: string) => {
  return (
    statusOptions.value.find((item) => item.value === value)?.label ??
    t('status.unknown')
  )
}

const statusVariant = (value?: string) => {
  switch (value) {
    case 'won':
      return 'default'
    case 'lost':
    case 'cancelled':
      return 'destructive'
    case 'contacted':
    case 'viewed':
      return 'secondary'
    case 'viewing_scheduled':
    case 'negotiating':
    case 'waiting_decision':
      return 'outline'
    default:
      return 'outline'
  }
}

const updateMutation = useMutation({
  mutationFn: (payload: {
    id: number
    status: LeadStatus
    status_note?: string | null
    lost_reason?: string | null
    next_follow_up_at?: string | null
    viewing_at?: string | null
  }) =>
    ContactService.updateAdminContactStatus(payload.id, {
      status: payload.status,
      status_note: payload.status_note,
      lost_reason: payload.lost_reason,
      next_follow_up_at: payload.next_follow_up_at,
      viewing_at: payload.viewing_at,
    }),
  onSuccess: () => {
    toast.success(t('pages.organizationContacts.messages.updateSuccess'))
    queryClient.invalidateQueries({ queryKey: ['admin_contacts_pipeline'] })
  },
  onError: () => {
    toast.error(t('pages.organizationContacts.messages.updateError'))
  },
})

const saveStatus = () => {
  if (!selectedContact.value) return

  if (status.value === 'viewing_scheduled' && !viewingAt.value) {
    toast.error(t('pages.organizationContacts.messages.viewingTimeRequired'))
    return
  }

  updateMutation.mutate({
    id: selectedContact.value.id,
    status: status.value,
    status_note: statusNote.value || null,
    lost_reason: status.value === 'lost' ? lostReason.value || null : null,
    next_follow_up_at: nextFollowUpAt.value || null,
    viewing_at: status.value === 'viewing_scheduled' ? viewingAt.value : null,
  })
}

const applyFilters = () => {
  filters.value.page = 1
  contactsQuery.refetch()
}

const goPrevPage = () => {
  if (filters.value.page <= 1) return
  filters.value.page--
  contactsQuery.refetch()
}

const goNextPage = () => {
  if (!meta.value || filters.value.page >= meta.value.last_page) return
  filters.value.page++
  contactsQuery.refetch()
}

const goToCreateDeal = () => {
  if (!selectedContact.value) return

  router.push({
    name: 'organizations.deals',
    query: {
      contact_id: String(selectedContact.value.id),
      room_id: String(selectedContact.value.room_id ?? ''),
      tenant_name: selectedContact.value.name ?? '',
      tenant_phone: selectedContact.value.phone ?? '',
      tenant_email: selectedContact.value.email ?? '',
    },
  })
}
</script>

<template>
  <div class="space-y-5 px-4 py-4 md:px-6">
    <div>
      <h2 class="text-2xl font-bold tracking-tight">
        {{ t('pages.organizationContacts.title') }}
      </h2>
      <p class="text-sm text-muted-foreground">
        {{ t('pages.organizationContacts.description') }}
      </p>
    </div>

    <div class="grid grid-cols-2 gap-3 xl:grid-cols-6">
      <Card
        v-for="item in summary"
        :key="item.label"
        class="border-border/70"
      >
        <CardContent class="p-4">
          <p class="text-xs text-muted-foreground">{{ item.label }}</p>
          <p class="mt-2 text-2xl font-bold">{{ item.value }}</p>
        </CardContent>
      </Card>
    </div>

    <Card class="border-border/70">
      <CardHeader class="pb-4">
        <CardTitle class="text-base">
          {{ t('pages.organizationContacts.filtersTitle') }}
        </CardTitle>
      </CardHeader>
      <CardContent class="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <div class="relative xl:col-span-8">
          <Search
            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            v-model="filters.keyword"
            class="pl-9"
            :placeholder="t('pages.organizationContacts.keywordPlaceholder')"
            @keyup.enter="applyFilters"
          />
        </div>

        <div class="xl:col-span-2">
          <Select
            :model-value="filters.status"
            @update:model-value="(v) => (filters.status = String(v))"
          >
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="t('pages.organizationContacts.statusPlaceholder')" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{{ t('common.all') }}</SelectItem>
              <SelectItem
                v-for="item in statusOptions"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="xl:col-span-2">
          <Button
            class="w-full"
            @click="applyFilters"
          >
            {{ t('pages.organizationContacts.applyFilters') }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <div class="grid grid-cols-1 gap-4 2xl:grid-cols-12">
      <Card class="border-border/70 2xl:col-span-5">
        <CardHeader class="pb-4">
          <CardTitle class="text-base">
            {{ t('pages.organizationContacts.listTitle') }}
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <div
            v-if="contactsQuery.isLoading.value"
            class="py-10 text-center text-sm text-muted-foreground"
          >
            {{ t('pages.organizationContacts.loadingData') }}
          </div>

          <div
            v-else-if="contacts.length === 0"
            class="py-10 text-center text-sm text-muted-foreground"
          >
            {{ t('pages.organizationContacts.emptyData') }}
          </div>

          <button
            v-for="item in contacts"
            :key="item.id"
            type="button"
            class="w-full rounded-xl border p-4 text-left transition hover:border-primary/50"
            :class="selectedId === item.id ? 'border-primary bg-primary/5' : ''"
            @click="selectedId = item.id"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="font-semibold">
                  {{
                    item.name || t('pages.organizationContacts.unknownGuest')
                  }}
                </div>
                <div class="mt-1 text-xs text-muted-foreground">
                  {{ item.room_title || t('pages.organizationContacts.noRoom') }}
                </div>
              </div>
              <Badge :variant="statusVariant(item.status)">
                {{ statusLabel(item.status) }}
              </Badge>
            </div>

            <div class="mt-3 grid gap-2 text-sm text-muted-foreground">
              <div class="flex items-center gap-2">
                <Phone class="h-4 w-4" />
                <span>{{ item.phone || t('common.notAvailable') }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Mail class="h-4 w-4" />
                <span>{{ item.email || t('common.notAvailable') }}</span>
              </div>
              <div class="flex items-center gap-2">
                <CalendarDays class="h-4 w-4" />
                <span>
                  {{ t('pages.organizationContacts.createdAt') }}:
                  {{ item.created_at || t('common.notAvailable') }}
                </span>
              </div>
            </div>
          </button>

          <div
            v-if="contacts.length > 0"
            class="flex items-center justify-between pt-2"
          >
            <Button
              variant="outline"
              :disabled="filters.page <= 1"
              @click="goPrevPage"
            >
              {{ t('pages.organizationContacts.previousPage') }}
            </Button>
            <div class="text-sm text-muted-foreground">
              {{
                t('pages.organizationContacts.pageText', {
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
              {{ t('pages.organizationContacts.nextPage') }}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card class="border-border/70 2xl:col-span-7">
        <CardHeader class="pb-4">
          <CardTitle class="text-base">
            {{ t('pages.organizationContacts.detailsTitle') }}
          </CardTitle>
        </CardHeader>

        <CardContent
          v-if="selectedContact"
          class="space-y-5"
        >
          <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-xl border p-4">
              <div class="text-xs uppercase text-muted-foreground">
                {{ t('pages.organizationContacts.customer') }}
              </div>
              <div class="mt-2 text-lg font-semibold">
                {{
                  selectedContact.name ||
                  t('pages.organizationContacts.unknownGuest')
                }}
              </div>
              <div class="mt-3 space-y-2 text-sm">
                <div>
                  <span class="font-medium">
                    {{ t('pages.organizationContacts.phone') }}:
                  </span>
                  {{ selectedContact.phone || t('common.notAvailable') }}
                </div>
                <div>
                  <span class="font-medium">
                    {{ t('pages.organizationContacts.email') }}:
                  </span>
                  {{ selectedContact.email || t('common.notAvailable') }}
                </div>
                <div>
                  <span class="font-medium">
                    {{ t('pages.organizationContacts.moveInDate') }}:
                  </span>
                  {{ selectedContact.move_in_date || t('common.notAvailable') }}
                </div>
                <div>
                  <span class="font-medium">
                    {{ t('pages.organizationContacts.preferredViewingTime') }}:
                  </span>
                  {{
                    selectedContact.preferred_viewing_time ||
                    t('common.notAvailable')
                  }}
                </div>
              </div>
            </div>

            <div class="rounded-xl border p-4">
              <div class="text-xs uppercase text-muted-foreground">
                {{ t('pages.organizationContacts.interestedRoom') }}
              </div>
              <div class="mt-2 text-lg font-semibold">
                {{ selectedContact.room_title || t('common.notAvailable') }}
              </div>
              <div class="mt-3 space-y-2 text-sm">
                <div>
                  <span class="font-medium">
                    {{ t('pages.organizationContacts.address') }}:
                  </span>
                  {{ selectedContact.room_address || t('common.notAvailable') }}
                </div>
                <div>
                  <span class="font-medium">
                    {{ t('pages.organizationContacts.price') }}:
                  </span>
                  {{ selectedContact.room_price || t('common.notAvailable') }}
                </div>
                <div>
                  <span class="font-medium">
                    {{ t('pages.organizationContacts.owner') }}:
                  </span>
                  {{ selectedContact.owner_name || t('common.notAvailable') }}
                </div>
                <div>
                  <span class="font-medium">
                    {{ t('pages.organizationContacts.ownerPhone') }}:
                  </span>
                  {{ selectedContact.owner_phone || t('common.notAvailable') }}
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border p-4">
            <div class="text-xs uppercase text-muted-foreground">
              {{ t('pages.organizationContacts.messageTitle') }}
            </div>
            <div class="mt-2 whitespace-pre-wrap text-sm">
              {{ selectedContact.message || t('pages.organizationContacts.noMessage') }}
            </div>
          </div>

          <div class="rounded-xl border p-4">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <div class="text-xs uppercase text-muted-foreground">
                  {{ t('pages.organizationContacts.pipelineTitle') }}
                </div>
                <div class="mt-1 text-sm text-muted-foreground">
                  {{ t('pages.organizationContacts.handledBy') }}:
                  {{
                    selectedContact.handled_by_name ||
                    t('pages.organizationContacts.unassigned')
                  }}
                </div>
              </div>

              <Badge :variant="statusVariant(selectedContact.status)">
                {{ statusLabel(selectedContact.status) }}
              </Badge>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <label class="text-sm font-medium">
                  {{ t('pages.organizationContacts.statusPlaceholder') }}
                </label>
                <Select
                  :model-value="status"
                  @update:model-value="(v) => (status = v as LeadStatus)"
                >
                  <SelectTrigger class="w-full">
                    <SelectValue
                      :placeholder="t('pages.organizationContacts.selectStatus')"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="item in statusOptions"
                      :key="item.value"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium">
                  {{ t('pages.organizationContacts.nextFollowUp') }}
                </label>
                <Input
                  v-model="nextFollowUpAt"
                  type="datetime-local"
                />
              </div>

              <div
                v-if="status === 'viewing_scheduled'"
                class="space-y-2"
              >
                <label class="text-sm font-medium">
                  {{ t('pages.organizationContacts.viewingTime') }}
                </label>
                <Input
                  v-model="viewingAt"
                  type="datetime-local"
                />
              </div>

              <div
                v-if="status === 'lost'"
                class="space-y-2"
              >
                <label class="text-sm font-medium">
                  {{ t('pages.organizationContacts.lostReason') }}
                </label>
                <Input
                  v-model="lostReason"
                  :placeholder="t('pages.organizationContacts.lostReasonPlaceholder')"
                />
              </div>

              <div class="space-y-2 md:col-span-2">
                <label class="text-sm font-medium">
                  {{ t('pages.organizationContacts.statusNote') }}
                </label>
                <Textarea
                  v-model="statusNote"
                  rows="4"
                  :placeholder="t('pages.organizationContacts.statusNotePlaceholder')"
                />
              </div>
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
              <Button
                :disabled="updateMutation.isPending.value"
                @click="saveStatus"
              >
                {{ t('pages.organizationContacts.saveStatus') }}
              </Button>

              <Button
                v-if="status === 'won' || selectedContact.status === 'won'"
                variant="outline"
                @click="goToCreateDeal"
              >
                <Handshake class="mr-2 h-4 w-4" />
                {{ t('pages.organizationContacts.createDeal') }}
              </Button>
            </div>
          </div>
        </CardContent>

        <CardContent
          v-else
          class="py-10 text-center text-sm text-muted-foreground"
        >
          {{ t('pages.organizationContacts.selectLeadPrompt') }}
        </CardContent>
      </Card>
    </div>
  </div>
</template>
