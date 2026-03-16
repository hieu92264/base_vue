<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { Search, Phone, Mail, CalendarDays, FileText } from 'lucide-vue-next'

import { ContactService } from '@/services/contact.service'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type ContactStatus = 'new' | 'contacted' | 'successful' | 'unsuccessful'

const queryClient = useQueryClient()

const filters = ref({
  keyword: '',
  status: 'all',
  page: 1,
  per_page: 10,
})

const params = computed(() => ({
  keyword: filters.value.keyword || undefined,
  status: filters.value.status !== 'all' ? filters.value.status : undefined,
  page: filters.value.page,
  per_page: filters.value.per_page,
}))

const contactsQuery = useQuery({
  queryKey: computed(() => ['admin_contacts', params.value]),
  queryFn: () => ContactService.getAdminContacts(params.value),
})

const contacts = computed(() => contactsQuery.data.value?.data ?? [])
const meta = computed(() => contactsQuery.data.value?.meta)

const selectedId = ref<number | null>(null)
const status = ref<ContactStatus>('new')
const statusNote = ref('')

watch(
  contacts,
  (rows) => {
    if (!rows.length) {
      selectedId.value = null
      status.value = 'new'
      statusNote.value = ''
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

watch(
  selectedContact,
  (row) => {
    status.value = (row?.status as ContactStatus) || 'new'
    statusNote.value = row?.status_note || ''
  },
  { immediate: true },
)

watch(
  () => [filters.value.keyword, filters.value.status],
  () => {
    filters.value.page = 1
  },
)

const statusLabel = (value?: string) => {
  switch (value) {
    case 'contacted':
      return 'Đã liên hệ'
    case 'successful':
      return 'Chốt thành công'
    case 'unsuccessful':
      return 'Không thành công'
    default:
      return 'Mới'
  }
}

const statusVariant = (value?: string) => {
  switch (value) {
    case 'successful':
      return 'default'
    case 'unsuccessful':
      return 'destructive'
    case 'contacted':
      return 'secondary'
    default:
      return 'outline'
  }
}

const updateMutation = useMutation({
  mutationFn: ({
    id,
    payload,
  }: {
    id: number
    payload: {
      status: ContactStatus
      status_note?: string | null
    }
  }) => ContactService.updateAdminContactStatus(id, payload),
  onSuccess: () => {
    toast.success('Cập nhật trạng thái lead thành công')
    queryClient.invalidateQueries({ queryKey: ['admin_contacts'] })
  },
  onError: () => {
    toast.error('Cập nhật trạng thái lead thất bại')
  },
})

const saveStatus = () => {
  if (!selectedContact.value) return

  updateMutation.mutate({
    id: selectedContact.value.id,
    payload: {
      status: status.value,
      status_note: statusNote.value || null,
    },
  })
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

const applyFilters = () => {
  filters.value.page = 1
  contactsQuery.refetch()
}

const onStatusChange = (v: string) => {
  status.value = v as ContactStatus
}
</script>

<template>
  <div class="space-y-5 px-4 py-4 md:px-6">
    <div>
      <h2 class="text-2xl font-bold tracking-tight">Quản lý contact / lead</h2>
      <p class="text-sm text-muted-foreground">
        Admin theo dõi lead, xem chi tiết và cập nhật trạng thái chăm sóc
      </p>
    </div>

    <Card class="border-border/70">
      <CardHeader class="pb-4">
        <CardTitle class="text-base">Bộ lọc</CardTitle>
      </CardHeader>

      <CardContent class="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <div class="relative xl:col-span-7">
          <Search
            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            v-model="filters.keyword"
            class="pl-9"
            placeholder="Tìm tên, email, số điện thoại, nội dung..."
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
              <SelectItem value="new">Mới</SelectItem>
              <SelectItem value="contacted">Đã liên hệ</SelectItem>
              <SelectItem value="successful">Chốt thành công</SelectItem>
              <SelectItem value="unsuccessful">Không thành công</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="xl:col-span-3">
          <Button
            class="w-full"
            @click="applyFilters"
            >Lọc dữ liệu</Button
          >
        </div>
      </CardContent>
    </Card>

    <div class="grid grid-cols-1 gap-4 2xl:grid-cols-12">
      <Card class="2xl:col-span-7 border-border/70">
        <CardHeader class="pb-4">
          <CardTitle class="text-base">Danh sách lead</CardTitle>
        </CardHeader>

        <CardContent>
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

          <div
            v-else
            class="overflow-x-auto rounded-md border"
          >
            <Table class="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[70px]">ID</TableHead>
                  <TableHead class="w-[220px]">Khách</TableHead>
                  <TableHead class="w-[320px]">Phòng</TableHead>
                  <TableHead class="w-[140px]">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow
                  v-for="row in contacts"
                  :key="row.id"
                  class="cursor-pointer align-top"
                  :class="selectedId === row.id ? 'bg-muted/50' : ''"
                  @click="selectedId = row.id"
                >
                  <TableCell class="font-medium">#{{ row.id }}</TableCell>

                  <TableCell class="align-top">
                    <div class="max-w-[210px]">
                      <div class="truncate font-medium">
                        {{ row.name || '---' }}
                      </div>
                      <div class="mt-1 truncate text-xs text-muted-foreground">
                        {{ row.phone || row.email || '---' }}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell class="align-top">
                    <div class="max-w-[300px]">
                      <div class="truncate font-medium">
                        {{ row.room_title || '---' }}
                      </div>
                      <div class="mt-1 truncate text-xs text-muted-foreground">
                        {{ row.room_address || row.room_slug || '---' }}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell class="align-top">
                    <Badge :variant="statusVariant(row.status)">
                      {{ statusLabel(row.status) }}
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div
            v-if="meta"
            class="mt-4 flex flex-col gap-3 border-t pt-4 text-sm md:flex-row md:items-center md:justify-between"
          >
            <div class="text-muted-foreground">
              Trang {{ meta.current_page }} / {{ meta.last_page }} · Tổng
              {{ meta.total }} lead
            </div>

            <div class="flex gap-2">
              <Button
                variant="outline"
                :disabled="filters.page <= 1"
                @click="goPrevPage"
              >
                Trang trước
              </Button>

              <Button
                variant="outline"
                :disabled="filters.page >= meta.last_page"
                @click="goNextPage"
              >
                Trang sau
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="2xl:col-span-5 border-border/70">
        <CardHeader class="pb-4">
          <CardTitle class="text-base">Chi tiết lead</CardTitle>
        </CardHeader>

        <CardContent
          v-if="selectedContact"
          class="space-y-5"
        >
          <div class="space-y-2">
            <div class="text-lg font-semibold leading-tight">
              {{ selectedContact.name || '---' }}
            </div>

            <div class="space-y-1 text-sm text-muted-foreground">
              <div class="flex items-center gap-2">
                <Phone class="h-4 w-4" />
                <span class="break-all">{{
                  selectedContact.phone || '---'
                }}</span>
              </div>

              <div class="flex items-center gap-2">
                <Mail class="h-4 w-4" />
                <span class="break-all">{{
                  selectedContact.email || '---'
                }}</span>
              </div>

              <div class="flex items-center gap-2">
                <CalendarDays class="h-4 w-4" />
                <span class="break-all">
                  Dự kiến dọn vào: {{ selectedContact.move_in_date || '---' }}
                </span>
              </div>
            </div>
          </div>

          <div class="rounded-lg border p-4">
            <div class="mb-2 text-sm font-medium">Phòng quan tâm</div>
            <div class="break-words font-medium">
              {{ selectedContact.room_title || '---' }}
            </div>
            <div class="mt-1 text-sm text-muted-foreground break-words">
              {{ selectedContact.room_address || '---' }}
            </div>
          </div>

          <div class="rounded-lg border p-4">
            <div class="mb-2 flex items-center gap-2 text-sm font-medium">
              <FileText class="h-4 w-4" />
              Nội dung
            </div>
            <div class="whitespace-pre-line break-words text-sm leading-6">
              {{ selectedContact.message || '---' }}
            </div>
          </div>

          <div class="space-y-3">
            <div class="text-sm font-medium">Cập nhật trạng thái</div>

            <Select
              :model-value="status"
              @update:model-value="onStatusChange"
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Mới</SelectItem>
                <SelectItem value="contacted">Đã liên hệ</SelectItem>
                <SelectItem value="successful">Chốt thành công</SelectItem>
                <SelectItem value="unsuccessful">Không thành công</SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              v-model="statusNote"
              rows="4"
              placeholder="Ghi chú chăm sóc lead..."
            />

            <Button
              class="w-full"
              :disabled="updateMutation.isPending.value"
              @click="saveStatus"
            >
              Lưu trạng thái
            </Button>
          </div>
        </CardContent>

        <CardContent
          v-else
          class="py-10 text-center text-sm text-muted-foreground"
        >
          Chọn 1 lead để xem chi tiết
        </CardContent>
      </Card>
    </div>
  </div>
</template>
