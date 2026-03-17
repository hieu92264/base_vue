<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { Search, Phone, Mail, CalendarDays, Handshake } from 'lucide-vue-next'

import { ContactService, type LeadStatus } from '@/services/contact.service'
import type { IContact } from '@/common/types/entities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const router = useRouter()
const queryClient = useQueryClient()

const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'Mới' },
  { value: 'contacted', label: 'Đã liên hệ' },
  { value: 'viewing_scheduled', label: 'Đã hẹn xem' },
  { value: 'viewed', label: 'Đã xem phòng' },
  { value: 'negotiating', label: 'Đang thương lượng' },
  { value: 'waiting_decision', label: 'Chờ quyết định' },
  { value: 'won', label: 'Chốt thành công' },
  { value: 'lost', label: 'Không thành công' },
  { value: 'cancelled', label: 'Đã hủy' },
]

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
  queryKey: computed(() => ['landlord_contacts_pipeline', params.value]),
  queryFn: () => ContactService.getLandlordContacts(params.value),
})

const contacts = computed<IContact[]>(
  () => contactsQuery.data.value?.data ?? [],
)
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
    { label: 'Lead mới', value: count('new') },
    { label: 'Đã liên hệ', value: count('contacted') },
    { label: 'Hẹn xem', value: count('viewing_scheduled') },
    { label: 'Thương lượng', value: count('negotiating') },
    { label: 'Chốt thành công', value: count('won') },
    { label: 'Thất bại', value: count('lost') },
  ]
})

const statusLabel = (value?: string) => {
  return (
    statusOptions.find((item) => item.value === value)?.label ??
    'Không xác định'
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
    ContactService.updateLandlordContactStatus(payload.id, {
      status: payload.status,
      status_note: payload.status_note,
      lost_reason: payload.lost_reason,
      next_follow_up_at: payload.next_follow_up_at,
      viewing_at: payload.viewing_at,
    }),
  onSuccess: () => {
    toast.success('Cập nhật lead thành công')
    queryClient.invalidateQueries({ queryKey: ['landlord_contacts_pipeline'] })
  },
  onError: () => {
    toast.error('Cập nhật lead thất bại')
  },
})

const saveStatus = () => {
  if (!selectedContact.value) return

  if (status.value === 'viewing_scheduled' && !viewingAt.value) {
    toast.error('Vui lòng nhập thời gian hẹn xem phòng')
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
    name: 'landlord.deals',
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
      <h2 class="text-2xl font-bold tracking-tight">Lead của tôi</h2>
      <p class="text-sm text-muted-foreground">
        Xử lý khách quan tâm, hẹn xem phòng và chuyển sang deal khi chốt thành
        công
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
        <CardTitle class="text-base">Bộ lọc</CardTitle>
      </CardHeader>
      <CardContent class="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <div class="relative xl:col-span-8">
          <Search
            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            v-model="filters.keyword"
            class="pl-9"
            placeholder="Tìm theo tên, email, điện thoại, nội dung..."
            @keyup.enter="applyFilters"
          />
        </div>

        <div class="xl:col-span-2">
          <Select
            :model-value="filters.status"
            @update:model-value="(v) => (filters.status = String(v))"
          >
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
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
            Lọc dữ liệu
          </Button>
        </div>
      </CardContent>
    </Card>

    <div class="grid grid-cols-1 gap-4 2xl:grid-cols-12">
      <Card class="2xl:col-span-5 border-border/70">
        <CardHeader class="pb-4">
          <CardTitle class="text-base">Danh sách lead</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <div
            v-if="contactsQuery.isLoading.value"
            class="py-10 text-center text-sm text-muted-foreground"
          >
            Đang tải dữ liệu...
          </div>

          <div
            v-else-if="contacts.length === 0"
            class="py-10 text-center text-sm text-muted-foreground"
          >
            Chưa có lead phù hợp bộ lọc.
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
                  {{ item.name || 'Khách chưa rõ tên' }}
                </div>
                <div class="mt-1 text-xs text-muted-foreground">
                  {{ item.room_title || 'Chưa có phòng' }}
                </div>
              </div>
              <Badge :variant="statusVariant(item.status)">
                {{ statusLabel(item.status) }}
              </Badge>
            </div>

            <div class="mt-3 grid gap-2 text-sm text-muted-foreground">
              <div class="flex items-center gap-2">
                <Phone class="h-4 w-4" />
                <span>{{ item.phone || '---' }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Mail class="h-4 w-4" />
                <span>{{ item.email || '---' }}</span>
              </div>
              <div class="flex items-center gap-2">
                <CalendarDays class="h-4 w-4" />
                <span>Ngày tạo: {{ item.created_at || '---' }}</span>
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
              Trang trước
            </Button>
            <div class="text-sm text-muted-foreground">
              Trang {{ meta?.current_page || 1 }} / {{ meta?.last_page || 1 }}
            </div>
            <Button
              variant="outline"
              :disabled="!meta || filters.page >= meta.last_page"
              @click="goNextPage"
            >
              Trang sau
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card class="2xl:col-span-7 border-border/70">
        <CardHeader class="pb-4">
          <CardTitle class="text-base">Chi tiết lead & thao tác</CardTitle>
        </CardHeader>

        <CardContent
          v-if="selectedContact"
          class="space-y-5"
        >
          <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-xl border p-4">
              <div class="text-xs uppercase text-muted-foreground">
                Khách hàng
              </div>
              <div class="mt-2 text-lg font-semibold">
                {{ selectedContact.name || 'Khách chưa rõ tên' }}
              </div>
              <div class="mt-3 space-y-2 text-sm">
                <div>
                  <span class="font-medium">Điện thoại:</span>
                  {{ selectedContact.phone || '---' }}
                </div>
                <div>
                  <span class="font-medium">Email:</span>
                  {{ selectedContact.email || '---' }}
                </div>
                <div>
                  <span class="font-medium">Ngày vào ở:</span>
                  {{ selectedContact.move_in_date || '---' }}
                </div>
                <div>
                  <span class="font-medium">Khung giờ muốn xem:</span>
                  {{ selectedContact.preferred_viewing_time || '---' }}
                </div>
              </div>
            </div>

            <div class="rounded-xl border p-4">
              <div class="text-xs uppercase text-muted-foreground">
                Phòng quan tâm
              </div>
              <div class="mt-2 text-lg font-semibold">
                {{ selectedContact.room_title || '---' }}
              </div>
              <div class="mt-3 space-y-2 text-sm">
                <div>
                  <span class="font-medium">Địa chỉ:</span>
                  {{ selectedContact.room_address || '---' }}
                </div>
                <div>
                  <span class="font-medium">Giá:</span>
                  {{ selectedContact.room_price || '---' }}
                </div>
                <div>
                  <span class="font-medium">SĐT chủ nhà:</span>
                  {{ selectedContact.owner_phone || '---' }}
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border p-4">
            <div class="text-xs uppercase text-muted-foreground">
              Nội dung khách gửi
            </div>
            <div class="mt-2 whitespace-pre-wrap text-sm">
              {{ selectedContact.message || 'Không có nội dung' }}
            </div>
          </div>

          <div class="rounded-xl border p-4">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <div class="text-xs uppercase text-muted-foreground">
                  Cập nhật pipeline
                </div>
                <div class="mt-1 text-sm text-muted-foreground">
                  Người xử lý:
                  {{ selectedContact.handled_by_name || 'Chưa có' }}
                </div>
              </div>

              <Badge :variant="statusVariant(selectedContact.status)">
                {{ statusLabel(selectedContact.status) }}
              </Badge>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <label class="text-sm font-medium">Trạng thái</label>
                <Select
                  :model-value="status"
                  @update:model-value="(v) => (status = v as LeadStatus)"
                >
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Chọn trạng thái" />
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
                <label class="text-sm font-medium">Follow up tiếp theo</label>
                <Input
                  v-model="nextFollowUpAt"
                  type="datetime-local"
                />
              </div>

              <div
                v-if="status === 'viewing_scheduled'"
                class="space-y-2"
              >
                <label class="text-sm font-medium">Thời gian hẹn xem</label>
                <Input
                  v-model="viewingAt"
                  type="datetime-local"
                />
              </div>

              <div
                v-if="status === 'lost'"
                class="space-y-2"
              >
                <label class="text-sm font-medium">Lý do thất bại</label>
                <Input
                  v-model="lostReason"
                  placeholder="Ví dụ: khách đổi nhu cầu, không phù hợp ngân sách..."
                />
              </div>

              <div class="space-y-2 md:col-span-2">
                <label class="text-sm font-medium">Ghi chú xử lý</label>
                <Textarea
                  v-model="statusNote"
                  rows="4"
                  placeholder="Nhập ghi chú chăm sóc lead..."
                />
              </div>
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
              <Button
                :disabled="updateMutation.isPending.value"
                @click="saveStatus"
              >
                Lưu trạng thái
              </Button>

              <Button
                v-if="status === 'won' || selectedContact.status === 'won'"
                variant="outline"
                @click="goToCreateDeal"
              >
                <Handshake class="mr-2 h-4 w-4" />
                Tạo deal
              </Button>
            </div>
          </div>
        </CardContent>

        <CardContent
          v-else
          class="py-10 text-center text-sm text-muted-foreground"
        >
          Chọn một lead để xem chi tiết
        </CardContent>
      </Card>
    </div>
  </div>
</template>
