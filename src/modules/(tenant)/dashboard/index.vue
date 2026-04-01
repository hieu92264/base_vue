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

const filters = ref({
  keyword: '',
  page: 1,
  per_page: 10,
})

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
  const map: Record<string, string> = {
    new: 'Mới gửi',
    contacted: 'Đã liên hệ',
    viewing_scheduled: 'Đã hẹn xem',
    viewed: 'Đã xem phòng',
    negotiating: 'Đang thương lượng',
    waiting_decision: 'Chờ quyết định',
    won: 'Đã chốt',
    lost: 'Không thành công',
    cancelled: 'Đã hủy',
    draft: 'Nháp',
    reserved: 'Giữ chỗ',
    confirmed: 'Đã xác nhận',
    completed: 'Hoàn tất',
  }

  return map[String(value ?? '')] ?? (value || 'Không xác định')
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
  const map: Record<string, string> = {
    available: 'Còn trống',
    reserved: 'Đã giữ chỗ',
    occupied: 'Đã có người thuê',
    hidden: 'Tạm ẩn',
    pending: 'Đang xử lý',
    confirmed: 'Đã xác nhận',
  }

  return map[String(value ?? '')] ?? (value || 'Chưa rõ')
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
      <h2 class="text-2xl font-bold tracking-tight">Phòng tôi đã liên hệ</h2>
      <p class="text-sm text-muted-foreground">
        Theo dõi các phòng bạn đã gửi form liên hệ, trạng thái xử lý và tình
        trạng còn trống/đã thuê.
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
            placeholder="Tìm theo tên phòng, địa chỉ, chủ nhà..."
            @keyup.enter="applyFilters"
          />
        </div>
        <Button
          class="rounded-xl"
          @click="applyFilters"
          >Tìm kiếm</Button
        >
      </CardContent>
    </Card>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <Card class="border-border/70">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-base">
            <Mail class="h-4 w-4" />
            Yêu cầu liên hệ đã gửi
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div
            v-if="contactsQuery.isLoading.value"
            class="text-sm text-muted-foreground"
          >
            Đang tải danh sách liên hệ...
          </div>
          <div
            v-else-if="!contacts.length"
            class="text-sm text-muted-foreground"
          >
            Bạn chưa gửi yêu cầu liên hệ nào.
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
                    {{ contact.room_title || 'Phòng đang cập nhật' }}
                  </div>
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ contact.room_address || 'Chưa có địa chỉ' }}
                </div>
                <div class="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span class="inline-flex items-center gap-1"
                    ><Phone class="h-3.5 w-3.5" />
                    {{ contact.owner_phone || 'Chưa có SĐT chủ nhà' }}</span
                  >
                  <span class="inline-flex items-center gap-1"
                    ><CalendarDays class="h-3.5 w-3.5" /> Dọn vào:
                    {{ contact.move_in_date || 'Chưa chọn' }}</span
                  >
                </div>
              </div>
              <div class="flex flex-col items-start gap-2 md:items-end">
                <Badge :variant="badgeVariant(contact.status) as any">{{
                  statusLabel(contact.status)
                }}</Badge>
                <div class="text-xs text-muted-foreground">
                  Gửi lúc:
                  {{
                    contact.created_at
                      ? new Date(contact.created_at).toLocaleString('vi-VN')
                      : '—'
                  }}
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
            Trạng thái thuê phòng
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div
            v-if="dealsQuery.isLoading.value"
            class="text-sm text-muted-foreground"
          >
            Đang tải trạng thái thuê phòng...
          </div>
          <div
            v-else-if="!deals.length"
            class="text-sm text-muted-foreground"
          >
            Chưa có phòng nào chuyển sang deal dưới tài khoản của bạn.
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
                  {{ deal.room_title || 'Phòng đang cập nhật' }}
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ deal.room_address || 'Chưa có địa chỉ' }}
                </div>
                <div class="text-sm text-muted-foreground">
                  Giá thỏa thuận:
                  {{ Number(deal.agreed_price || 0).toLocaleString('vi-VN') }}
                  {{ deal.currency || 'VND' }}
                </div>
                <div class="text-sm text-muted-foreground">
                  Tình trạng phòng:
                  <span class="font-medium text-foreground">{{
                    roomAvailabilityLabel(
                      deal.room_availability_status ?? undefined,
                    )
                  }}</span>
                </div>
              </div>
              <div class="flex flex-col items-start gap-2 md:items-end">
                <Badge :variant="badgeVariant(deal.status) as any">{{
                  statusLabel(deal.status)
                }}</Badge>
                <div class="text-xs text-muted-foreground">
                  Bắt đầu thuê: {{ deal.start_date || 'Chưa chốt' }}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
