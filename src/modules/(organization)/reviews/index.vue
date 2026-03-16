<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { Search, MessageSquareText, Star } from 'lucide-vue-next'

import { ReviewService } from '@/services/review.service'
import type { IComment } from '@/common/types/entities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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

type ReviewStatusFilter = 'all' | 'visible' | 'hidden'
type ReviewModerationStatus = 'visible' | 'hidden'

const queryClient = useQueryClient()

const filters = ref<{
  keyword: string
  status: ReviewStatusFilter
  page: number
  per_page: number
}>({
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

const reviewsQuery = useQuery({
  queryKey: computed(() => ['review_moderation_list', params.value]),
  queryFn: () => ReviewService.getModerationReviews(params.value),
})

const rows = computed(() => reviewsQuery.data.value?.data ?? [])
const meta = computed(() => reviewsQuery.data.value?.meta)

const selectedId = ref<number | null>(null)

watch(
  rows,
  (items) => {
    if (!items.length) {
      selectedId.value = null
      return
    }

    if (!items.some((item) => item.id === selectedId.value)) {
      selectedId.value = items[0]?.id ?? null
    }
  },
  { immediate: true },
)

watch(
  () => [filters.value.keyword, filters.value.status],
  () => {
    filters.value.page = 1
  },
)

const selectedReview = computed<IComment | null>(() => {
  return rows.value.find((item) => item.id === selectedId.value) ?? null
})

const updateMutation = useMutation({
  mutationFn: ({
    id,
    status,
  }: {
    id: number
    status: ReviewModerationStatus
  }) => ReviewService.updateModerationStatus(id, { status }),
  onSuccess: () => {
    toast.success('Cập nhật review thành công')
    queryClient.invalidateQueries({ queryKey: ['review_moderation_list'] })
  },
  onError: () => {
    toast.error('Cập nhật review thất bại')
  },
})

const statusLabel = (status?: string) => {
  return status === 'hidden' ? 'Đã ẩn' : 'Hiển thị'
}

const statusVariant = (status?: string) => {
  return status === 'hidden' ? 'destructive' : 'secondary'
}

const applyFilters = () => {
  filters.value.page = 1
  reviewsQuery.refetch()
}

const onFilterStatusChange = (v: string) => {
  filters.value.status = v as ReviewStatusFilter
}

const goPrevPage = () => {
  if (filters.value.page <= 1) return
  filters.value.page--
  reviewsQuery.refetch()
}

const goNextPage = () => {
  if (!meta.value || filters.value.page >= meta.value.last_page) return
  filters.value.page++
  reviewsQuery.refetch()
}

const updateReviewStatus = (status: ReviewModerationStatus) => {
  if (!selectedReview.value) return

  updateMutation.mutate({
    id: selectedReview.value.id,
    status,
  })
}
</script>

<template>
  <div class="space-y-5 px-4 py-4 md:px-6">
    <div>
      <h2 class="text-2xl font-bold tracking-tight">
        Review / Comment moderation
      </h2>
      <p class="text-sm text-muted-foreground">
        Ẩn/hiện review và theo dõi phản hồi của chủ nhà
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
            placeholder="Tìm theo nội dung, phòng, người dùng..."
            @keyup.enter="applyFilters"
          />
        </div>

        <div class="xl:col-span-2">
          <Select
            :model-value="filters.status"
            @update:model-value="onFilterStatusChange"
          >
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="visible">Hiển thị</SelectItem>
              <SelectItem value="hidden">Đã ẩn</SelectItem>
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
          <CardTitle class="text-base">Danh sách review</CardTitle>
        </CardHeader>

        <CardContent>
          <div
            v-if="reviewsQuery.isLoading.value"
            class="py-10 text-center text-sm text-muted-foreground"
          >
            Đang tải dữ liệu...
          </div>

          <div
            v-else-if="rows.length === 0"
            class="py-10 text-center text-sm text-muted-foreground"
          >
            Chưa có review phù hợp bộ lọc.
          </div>

          <div
            v-else
            class="overflow-x-auto rounded-md border"
          >
            <Table class="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[70px]">ID</TableHead>
                  <TableHead class="w-[300px]">Phòng</TableHead>
                  <TableHead class="w-[220px]">Người đánh giá</TableHead>
                  <TableHead class="w-[90px]">Rating</TableHead>
                  <TableHead class="w-[120px]">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow
                  v-for="row in rows"
                  :key="row.id"
                  class="cursor-pointer align-top"
                  :class="selectedId === row.id ? 'bg-muted/50' : ''"
                  @click="selectedId = row.id"
                >
                  <TableCell class="font-medium">#{{ row.id }}</TableCell>

                  <TableCell class="align-top">
                    <div class="max-w-[280px]">
                      <div class="truncate font-medium">
                        {{ row.room_title || row.room?.title || '---' }}
                      </div>
                      <div class="mt-1 truncate text-xs text-muted-foreground">
                        {{ row.room_slug || row.room?.slug || '---' }}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell class="align-top">
                    <div class="max-w-[200px]">
                      <div class="truncate font-medium">
                        {{
                          row.user_name ||
                          row.user?.profile?.full_name ||
                          row.user?.username ||
                          '---'
                        }}
                      </div>
                      <div class="mt-1 truncate text-xs text-muted-foreground">
                        {{ row.user?.email || '---' }}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell class="align-top">
                    <div
                      class="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm"
                    >
                      <Star class="h-3.5 w-3.5" />
                      {{ row.rating || '---' }}
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
              {{ meta.total }} review
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
          <CardTitle class="text-base">Chi tiết review</CardTitle>
        </CardHeader>

        <CardContent
          v-if="selectedReview"
          class="space-y-5"
        >
          <div>
            <div class="text-lg font-semibold leading-tight">
              {{
                selectedReview.user_name ||
                selectedReview.user?.profile?.full_name ||
                selectedReview.user?.username ||
                '---'
              }}
            </div>

            <div class="mt-1 text-sm text-muted-foreground">
              {{
                selectedReview.room_title || selectedReview.room?.title || '---'
              }}
            </div>
          </div>

          <div class="rounded-lg border p-4">
            <div class="mb-2 flex items-center gap-2 text-sm font-medium">
              <MessageSquareText class="h-4 w-4" />
              Nội dung review
            </div>
            <div class="whitespace-pre-line break-words text-sm leading-6">
              {{ selectedReview.content || '---' }}
            </div>
          </div>

          <div class="flex gap-3">
            <Button
              class="flex-1"
              :disabled="updateMutation.isPending.value"
              @click="updateReviewStatus('visible')"
            >
              Hiện review
            </Button>

            <Button
              class="flex-1"
              variant="destructive"
              :disabled="updateMutation.isPending.value"
              @click="updateReviewStatus('hidden')"
            >
              Ẩn review
            </Button>
          </div>
        </CardContent>

        <CardContent
          v-else
          class="py-10 text-center text-sm text-muted-foreground"
        >
          Chọn 1 review để xem chi tiết
        </CardContent>
      </Card>
    </div>
  </div>
</template>
