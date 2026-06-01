<script setup lang="ts">
import type { IComment } from '@/common/types/entities'
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
import { ReviewService } from '@/services/review.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { MessageSquareText, Search, Star } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'

type ReviewStatusFilter = 'all' | 'pending' | 'visible' | 'hidden'
type ReviewModerationStatus = 'pending' | 'visible' | 'hidden'

const { t } = useI18n()
const queryClient = useQueryClient()

const filters = ref({
  keyword: '',
  status: 'all' as ReviewStatusFilter,
  page: 1,
  per_page: 12,
})

const params = computed(() => ({
  keyword: filters.value.keyword || undefined,
  status: filters.value.status !== 'all' ? filters.value.status : undefined,
  page: filters.value.page,
  per_page: filters.value.per_page,
}))

const reviewsQuery = useQuery({
  queryKey: computed(() => ['review_moderation_list_v2', params.value]),
  queryFn: () => ReviewService.getModerationReviews(params.value),
})

const rows = computed<IComment[]>(() => reviewsQuery.data.value?.data ?? [])
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

const selectedReview = computed<IComment | null>(() => {
  return rows.value.find((item) => item.id === selectedId.value) ?? null
})

const summary = computed(() => {
  const count = (target: string) =>
    rows.value.filter((item) => item.status === target).length

  return [
    { label: t('status.review.pending'), value: count('pending') },
    { label: t('status.review.visible'), value: count('visible') },
    { label: t('status.review.hidden'), value: count('hidden') },
  ]
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
    toast.success(t('pages.organizationReviews.messages.updateSuccess'))
    queryClient.invalidateQueries({ queryKey: ['review_moderation_list_v2'] })
  },
  onError: () => {
    toast.error(t('pages.organizationReviews.messages.updateError'))
  },
})

const statusLabel = (status?: string) => {
  switch (status) {
    case 'pending':
      return t('status.review.pending')
    case 'hidden':
      return t('status.review.hidden')
    default:
      return t('status.review.visible')
  }
}

const statusVariant = (status?: string) => {
  switch (status) {
    case 'pending':
      return 'outline'
    case 'hidden':
      return 'destructive'
    default:
      return 'secondary'
  }
}

const applyFilters = () => {
  filters.value.page = 1
  reviewsQuery.refetch()
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
</script>

<template>
  <div class="space-y-5 px-4 py-4 md:px-6">
    <div>
      <h2 class="text-2xl font-bold tracking-tight">
        {{ t('pages.organizationReviews.title') }}
      </h2>
      <p class="text-sm text-muted-foreground">
        {{ t('pages.organizationReviews.description') }}
      </p>
    </div>

    <div class="grid grid-cols-3 gap-3">
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
          {{ t('pages.organizationReviews.filtersTitle') }}
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
            :placeholder="t('pages.organizationReviews.keywordPlaceholder')"
            @keyup.enter="applyFilters"
          />
        </div>

        <div class="xl:col-span-2">
          <Select
            :model-value="filters.status"
            @update:model-value="
              (v) => (filters.status = v as ReviewStatusFilter)
            "
          >
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="t('pages.organizationReviews.statusPlaceholder')" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{{ t('common.all') }}</SelectItem>
              <SelectItem value="pending">{{ t('status.review.pending') }}</SelectItem>
              <SelectItem value="visible">{{ t('status.review.visible') }}</SelectItem>
              <SelectItem value="hidden">{{ t('status.review.hidden') }}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="xl:col-span-2">
          <Button
            class="w-full"
            @click="applyFilters"
          >
            {{ t('pages.organizationReviews.applyFilters') }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <div class="grid grid-cols-1 gap-4 2xl:grid-cols-12">
      <Card class="border-border/70 2xl:col-span-5">
        <CardHeader class="pb-4">
          <CardTitle class="text-base">
            {{ t('pages.organizationReviews.listTitle') }}
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <div
            v-if="reviewsQuery.isLoading.value"
            class="py-10 text-center text-sm text-muted-foreground"
          >
            {{ t('pages.organizationReviews.loadingData') }}
          </div>

          <div
            v-else-if="rows.length === 0"
            class="py-10 text-center text-sm text-muted-foreground"
          >
            {{ t('pages.organizationReviews.emptyData') }}
          </div>

          <button
            v-for="item in rows"
            :key="item.id"
            type="button"
            class="w-full rounded-xl border p-4 text-left transition hover:border-primary/50"
            :class="selectedId === item.id ? 'border-primary bg-primary/5' : ''"
            @click="selectedId = item.id"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="font-semibold">
                {{ item.user_name || t('pages.organizationReviews.userFallback') }}
              </div>
              <Badge :variant="statusVariant(item.status) as any">
                {{ statusLabel(item.status) }}
              </Badge>
            </div>

            <div class="mt-2 flex items-center gap-1 text-amber-500">
              <Star
                v-for="n in 5"
                :key="n"
                class="h-4 w-4"
                :class="Number(item.rating || 0) >= n ? 'fill-current' : ''"
              />
            </div>

            <div class="mt-3 line-clamp-3 text-sm text-muted-foreground">
              {{ item.content }}
            </div>

            <div class="mt-3 text-xs text-muted-foreground">
              {{ t('pages.organizationReviews.roomLabel') }}:
              {{ item.room_title || t('common.notAvailable') }}
            </div>
          </button>

          <div
            v-if="rows.length > 0"
            class="flex items-center justify-between pt-2"
          >
            <Button
              variant="outline"
              :disabled="filters.page <= 1"
              @click="goPrevPage"
            >
              {{ t('pages.organizationReviews.previousPage') }}
            </Button>
            <div class="text-sm text-muted-foreground">
              {{
                t('pages.organizationReviews.pageText', {
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
              {{ t('pages.organizationReviews.nextPage') }}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card class="border-border/70 2xl:col-span-7">
        <CardHeader class="pb-4">
          <CardTitle class="text-base">
            {{ t('pages.organizationReviews.detailsTitle') }}
          </CardTitle>
        </CardHeader>

        <CardContent
          v-if="selectedReview"
          class="space-y-5"
        >
          <div class="rounded-xl border p-4">
            <div class="mb-3 flex items-start justify-between gap-3">
              <div>
                <div class="font-semibold">
                  {{
                    selectedReview.user_name ||
                    t('pages.organizationReviews.userFallback')
                  }}
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ selectedReview.room_title || t('common.notAvailable') }}
                </div>
              </div>

              <Badge :variant="statusVariant(selectedReview.status) as any">
                {{ statusLabel(selectedReview.status) }}
              </Badge>
            </div>

            <div class="mb-3 flex items-center gap-1 text-amber-500">
              <Star
                v-for="n in 5"
                :key="n"
                class="h-4 w-4"
                :class="
                  Number(selectedReview.rating || 0) >= n ? 'fill-current' : ''
                "
              />
            </div>

            <div class="whitespace-pre-wrap text-sm leading-6">
              {{ selectedReview.content }}
            </div>
          </div>

          <div class="rounded-xl border p-4">
            <div class="mb-3 flex items-center gap-2 font-medium">
              <MessageSquareText class="h-4 w-4" />
              {{ t('pages.organizationReviews.repliesTitle') }}
            </div>

            <div
              v-if="
                !selectedReview.replies || selectedReview.replies.length === 0
              "
              class="text-sm text-muted-foreground"
            >
              {{ t('pages.organizationReviews.noReplies') }}
            </div>

            <div
              v-else
              class="space-y-3"
            >
              <div
                v-for="reply in selectedReview.replies"
                :key="reply.id"
                class="rounded-lg border bg-muted/30 p-3"
              >
                <div class="text-sm font-medium">
                  {{
                    reply.user_name ||
                    t('pages.organizationReviews.replyUserFallback')
                  }}
                </div>
                <div class="mt-1 text-sm text-muted-foreground">
                  {{ reply.content }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <Button
              variant="outline"
              :disabled="updateMutation.isPending.value"
              @click="
                updateMutation.mutate({
                  id: selectedReview.id,
                  status: 'pending',
                })
              "
            >
              {{ t('pages.organizationReviews.moveToPending') }}
            </Button>

            <Button
              :disabled="updateMutation.isPending.value"
              @click="
                updateMutation.mutate({
                  id: selectedReview.id,
                  status: 'visible',
                })
              "
            >
              {{ t('pages.organizationReviews.approveVisible') }}
            </Button>

            <Button
              variant="destructive"
              :disabled="updateMutation.isPending.value"
              @click="
                updateMutation.mutate({
                  id: selectedReview.id,
                  status: 'hidden',
                })
              "
            >
              {{ t('pages.organizationReviews.hideReview') }}
            </Button>
          </div>
        </CardContent>

        <CardContent
          v-else
          class="py-10 text-center text-sm text-muted-foreground"
        >
          {{ t('pages.organizationReviews.selectReviewPrompt') }}
        </CardContent>
      </Card>
    </div>
  </div>
</template>
