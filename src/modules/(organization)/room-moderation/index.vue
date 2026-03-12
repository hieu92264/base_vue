<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { Search, Check, X, EyeOff } from 'lucide-vue-next'

import { LandlordService } from '@/services/landlord.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const queryClient = useQueryClient()

const filters = ref({
  keyword: '',
  post_status: 'pending',
  page: 1,
  per_page: 10,
})

const searchParams = computed(() => ({
  keyword: filters.value.keyword || undefined,
  post_status:
    filters.value.post_status !== 'all' ? filters.value.post_status : undefined,
  page: filters.value.page,
  per_page: filters.value.per_page,
}))

const roomsQuery = useQuery({
  queryKey: computed(() => ['room_moderation_list', searchParams.value]),
  queryFn: () => LandlordService.getModerationRooms(searchParams.value),
})

const rooms = computed(() => roomsQuery.data.value?.data ?? [])

const mutation = useMutation({
  mutationFn: ({
    roomId,
    post_status,
  }: {
    roomId: number
    post_status: 'approved' | 'rejected' | 'hidden'
  }) =>
    LandlordService.updateModerationStatus(roomId, {
      post_status,
    }),
  onSuccess: () => {
    toast.success('Cập nhật duyệt bài thành công')
    queryClient.invalidateQueries({ queryKey: ['room_moderation_list'] })
    queryClient.invalidateQueries({ queryKey: ['landlord_my_rooms'] })
  },
  onError: () => {
    toast.error('Cập nhật duyệt bài thất bại')
  },
})

const statusLabel = (status?: string) => {
  switch (status) {
    case 'approved':
      return 'Đã duyệt'
    case 'rejected':
      return 'Từ chối'
    case 'hidden':
      return 'Đã ẩn'
    default:
      return 'Chờ duyệt'
  }
}

const statusVariant = (status?: string) => {
  switch (status) {
    case 'approved':
      return 'default'
    case 'rejected':
      return 'destructive'
    case 'hidden':
      return 'secondary'
    default:
      return 'outline'
  }
}

const formatMoney = (value?: number) =>
  new Intl.NumberFormat('vi-VN').format(Number(value ?? 0))
</script>

<template>
  <div class="space-y-4 px-4 py-3">
    <div>
      <h2 class="text-2xl font-bold">Duyệt tin đăng</h2>
      <p class="text-sm text-muted-foreground">
        Pending / approved / rejected / hidden
      </p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Bộ lọc</CardTitle>
      </CardHeader>
      <CardContent class="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div class="relative">
          <Search
            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            v-model="filters.keyword"
            class="pl-9"
            placeholder="Tìm theo tiêu đề, slug, địa chỉ"
          />
        </div>

        <Select
          :model-value="filters.post_status"
          @update:model-value="(v) => (filters.post_status = String(v))"
        >
          <SelectTrigger>
            <SelectValue placeholder="Trạng thái duyệt" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
            <SelectItem value="hidden">Đã ẩn</SelectItem>
          </SelectContent>
        </Select>

        <Button @click="roomsQuery.refetch()">Lọc</Button>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Danh sách tin</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="roomsQuery.isLoading.value">Đang tải...</div>

        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Ảnh</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Chủ nhà</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead class="w-65">Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow
              v-for="room in rooms"
              :key="room.id"
            >
              <TableCell>#{{ room.id }}</TableCell>
              <TableCell>
                <img
                  :src="
                    room.photos?.find((p) => p.is_cover)?.photo_url ||
                    room.photos?.[0]?.photo_url ||
                    'https://placehold.co/120x80?text=No+Image'
                  "
                  class="h-16 w-24 rounded border object-cover"
                />
              </TableCell>
              <TableCell>
                <div class="font-medium">{{ room.title }}</div>
                <div class="text-xs text-muted-foreground">{{ room.slug }}</div>
              </TableCell>
              <TableCell>
                {{
                  room.owner?.profile?.full_name ||
                  room.owner?.username ||
                  room.owner?.email ||
                  '-'
                }}
              </TableCell>
              <TableCell>{{ formatMoney(Number(room.price)) }} đ</TableCell>
              <TableCell>
                <Badge :variant="statusVariant(room.post_status) as any">
                  {{ statusLabel(room.post_status) }}
                </Badge>
              </TableCell>
              <TableCell>
                <div class="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    :disabled="mutation.isPending.value"
                    @click="
                      mutation.mutate({
                        roomId: room.id,
                        post_status: 'approved',
                      })
                    "
                  >
                    <Check class="mr-2 h-4 w-4" />
                    Duyệt
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    :disabled="mutation.isPending.value"
                    @click="
                      mutation.mutate({
                        roomId: room.id,
                        post_status: 'rejected',
                      })
                    "
                  >
                    <X class="mr-2 h-4 w-4" />
                    Từ chối
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    :disabled="mutation.isPending.value"
                    @click="
                      mutation.mutate({
                        roomId: room.id,
                        post_status: 'hidden',
                      })
                    "
                  >
                    <EyeOff class="mr-2 h-4 w-4" />
                    Ẩn
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
