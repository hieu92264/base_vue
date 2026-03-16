<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

import { ReviewService } from '@/services/review.service'
import { useAuthStore } from '@/stores/auth.store'
import type { IComment } from '@/common/types/entities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

const props = defineProps<{
  roomId: number
}>()

const authStore = useAuthStore()
const queryClient = useQueryClient()

const reviewForm = ref({
  content: '',
  rating: 5,
})

const replyDrafts = ref<Record<number, string>>({})

const reviewsQuery = useQuery({
  queryKey: computed(() => ['room_reviews', props.roomId]),
  queryFn: () =>
    ReviewService.getRoomReviews(props.roomId, { page: 1, per_page: 20 }),
})

const reviews = computed<IComment[]>(() => reviewsQuery.data.value?.data ?? [])
const summary = computed(() => (reviewsQuery.data.value as any)?.summary ?? {})

const createMutation = useMutation({
  mutationFn: () =>
    ReviewService.createReview(props.roomId, {
      content: reviewForm.value.content,
      rating: Number(reviewForm.value.rating),
    }),
  onSuccess: () => {
    toast.success('Gửi review thành công')
    reviewForm.value.content = ''
    reviewForm.value.rating = 5
    queryClient.invalidateQueries({ queryKey: ['room_reviews', props.roomId] })
  },
  onError: () => {
    toast.error('Gửi review thất bại')
  },
})

const replyMutation = useMutation({
  mutationFn: ({
    commentId,
    content,
  }: {
    commentId: number
    content: string
  }) => ReviewService.replyReview(commentId, { content }),
  onSuccess: () => {
    toast.success('Phản hồi thành công')
    queryClient.invalidateQueries({ queryKey: ['room_reviews', props.roomId] })
  },
  onError: () => {
    toast.error('Phản hồi thất bại')
  },
})

const submitReply = (commentId: number) => {
  const content = replyDrafts.value[commentId]?.trim()
  if (!content) return

  replyMutation.mutate({ commentId, content })
  replyDrafts.value[commentId] = ''
}
</script>

<template>
  <Card class="mt-6">
    <CardHeader>
      <CardTitle>
        Đánh giá phòng
        <span class="ml-2 text-sm font-normal text-muted-foreground">
          ({{ summary.total_reviews || 0 }} đánh giá ·
          {{ summary.avg_rating || 0 }}/5)
        </span>
      </CardTitle>
    </CardHeader>

    <CardContent class="space-y-6">
      <div
        v-if="authStore.access_token"
        class="space-y-3 rounded-lg border p-4"
      >
        <div class="text-sm font-medium">Viết đánh giá</div>

        <Input
          v-model="reviewForm.rating"
          type="number"
          min="1"
          max="5"
        />

        <Textarea
          v-model="reviewForm.content"
          rows="4"
          placeholder="Chia sẻ trải nghiệm của bạn..."
        />

        <Button
          :disabled="
            createMutation.isPending.value || !reviewForm.content.trim()
          "
          @click="createMutation.mutate()"
        >
          Gửi đánh giá
        </Button>
      </div>

      <div
        v-if="reviews.length === 0"
        class="py-8 text-center text-sm text-muted-foreground"
      >
        Chưa có đánh giá nào.
      </div>

      <div
        v-else
        class="space-y-4"
      >
        <div
          v-for="review in reviews"
          :key="review.id"
          class="rounded-lg border p-4"
        >
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="font-medium">
                {{
                  review.user_name ||
                  review.user?.profile?.full_name ||
                  review.user?.username ||
                  'Ẩn danh'
                }}
              </div>
              <div class="text-sm text-muted-foreground">
                Rating: {{ review.rating || '---' }}/5
              </div>
            </div>

            <div class="text-xs text-muted-foreground">
              {{ review.created_at }}
            </div>
          </div>

          <div class="mt-3 whitespace-pre-line text-sm">
            {{ review.content }}
          </div>

          <div
            v-if="review.replies?.length"
            class="mt-4 space-y-2 border-l pl-4"
          >
            <div
              v-for="reply in review.replies"
              :key="reply.id"
              class="rounded-md bg-muted/40 p-3"
            >
              <div class="text-sm font-medium">
                {{
                  reply.user_name ||
                  reply.user?.profile?.full_name ||
                  reply.user?.username ||
                  'Người phản hồi'
                }}
              </div>
              <div class="mt-1 text-sm whitespace-pre-line">
                {{ reply.content }}
              </div>
            </div>
          </div>

          <div
            v-if="authStore.access_token"
            class="mt-4 space-y-2"
          >
            <Textarea
              v-model="replyDrafts[review.id]"
              rows="3"
              placeholder="Phản hồi review này..."
            />
            <Button
              variant="outline"
              :disabled="
                replyMutation.isPending.value || !replyDrafts[review.id]?.trim()
              "
              @click="submitReply(review.id)"
            >
              Gửi phản hồi
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
