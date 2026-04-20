<script setup lang="ts">
import { DateFormatterLocale, Language } from '@/common/constants/enums'
import type { IRoom } from '@/common/types/entities'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { LandlordService } from '@/services/landlord.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  CheckCircle2,
  EyeOff,
  Mail,
  MapPin,
  Phone,
  RefreshCcw,
  Search,
  UserRound,
  Wallet,
  XCircle,
  Clock3,
} from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'

const { t, locale } = useI18n()
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
const meta = computed(() => roomsQuery.data.value?.meta)

const selectedRoomId = ref<number | null>(null)
const moderationNote = ref('')

watch(
  rooms,
  (nextRooms) => {
    if (!nextRooms.length) {
      selectedRoomId.value = null
      moderationNote.value = ''
      return
    }

    const exists = nextRooms.some((room) => room.id === selectedRoomId.value)
    if (!exists) {
      selectedRoomId.value = nextRooms[0]?.id ?? null
    }
  },
  { immediate: true },
)

const selectedRoom = computed<IRoom | null>(() => {
  const found = rooms.value.find((room) => room.id === selectedRoomId.value)
  return found ?? null
})

watch(
  selectedRoom,
  (room) => {
    moderationNote.value = room?.moderation_note ?? ''
  },
  { immediate: true },
)

const statusLabel = (status?: string) => {
  switch (status) {
    case 'approved':
      return t('status.moderation.approved')
    case 'rejected':
      return t('status.moderation.rejected')
    case 'hidden':
      return t('status.moderation.hidden')
    default:
      return t('status.moderation.pending')
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

const formatMoney = (value?: number | string | null) =>
  new Intl.NumberFormat(
    DateFormatterLocale[locale.value as Language] ??
      DateFormatterLocale[Language.VIETNAMESE],
  ).format(Number(value ?? 0))

const getCover = (room?: IRoom | null) =>
  room?.photos?.find((photo) => photo.is_cover)?.photo_url ||
  room?.photos?.[0]?.photo_url ||
  `https://placehold.co/800x500?text=${t('pages.organizationRoomModeration.noImagePlaceholder')}`

const mutateStatus = useMutation({
  mutationFn: ({
    roomId,
    post_status,
    moderation_note,
  }: {
    roomId: number
    post_status: 'pending' | 'approved' | 'rejected' | 'hidden'
    moderation_note?: string | null
  }) =>
    LandlordService.updateModerationStatus(roomId, {
      post_status,
      moderation_note,
    }),
  onSuccess: () => {
    toast.success(t('pages.organizationRoomModeration.messages.updateSuccess'))
    queryClient.invalidateQueries({ queryKey: ['room_moderation_list'] })
    queryClient.invalidateQueries({ queryKey: ['landlord_my_rooms'] })
  },
  onError: () => {
    toast.error(t('pages.organizationRoomModeration.messages.updateError'))
  },
})

const applyStatus = (
  post_status: 'pending' | 'approved' | 'rejected' | 'hidden',
) => {
  if (!selectedRoom.value) return

  mutateStatus.mutate({
    roomId: selectedRoom.value.id,
    post_status,
    moderation_note: moderationNote.value || null,
  })
}
</script>

<template>
  <div class="space-y-4 px-4 py-4">
    <div>
      <h2 class="text-2xl font-bold">
        {{ t('pages.organizationRoomModeration.title') }}
      </h2>
      <p class="text-sm text-muted-foreground">
        {{ t('pages.organizationRoomModeration.description') }}
      </p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>{{ t('pages.organizationRoomModeration.filtersTitle') }}</CardTitle>
      </CardHeader>
      <CardContent class="grid grid-cols-1 gap-3 md:grid-cols-4">
        <div class="relative md:col-span-2">
          <Search
            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            v-model="filters.keyword"
            class="pl-9"
            :placeholder="t('pages.organizationRoomModeration.keywordPlaceholder')"
            @keyup.enter="roomsQuery.refetch()"
          />
        </div>

        <Select
          :model-value="filters.post_status"
          @update:model-value="(v) => (filters.post_status = String(v))"
        >
          <SelectTrigger>
            <SelectValue :placeholder="t('pages.organizationRoomModeration.statusPlaceholder')" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{{ t('common.all') }}</SelectItem>
            <SelectItem value="pending">{{ t('status.moderation.pending') }}</SelectItem>
            <SelectItem value="approved">{{ t('status.moderation.approved') }}</SelectItem>
            <SelectItem value="rejected">{{ t('status.moderation.rejected') }}</SelectItem>
            <SelectItem value="hidden">{{ t('status.moderation.hidden') }}</SelectItem>
          </SelectContent>
        </Select>

        <Button @click="roomsQuery.refetch()">
          {{ t('pages.organizationRoomModeration.applyFilters') }}
        </Button>
      </CardContent>
    </Card>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-5">
      <Card class="xl:col-span-3">
        <CardHeader>
          <CardTitle>{{ t('pages.organizationRoomModeration.listTitle') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            v-if="roomsQuery.isLoading.value"
            class="py-10 text-center text-sm text-muted-foreground"
          >
            {{ t('pages.organizationRoomModeration.loadingData') }}
          </div>

          <div
            v-else-if="rooms.length === 0"
            class="py-10 text-center text-sm text-muted-foreground"
          >
            {{ t('pages.organizationRoomModeration.emptyData') }}
          </div>

          <Table
            v-else
            class="min-w-[760px]"
          >
            <TableHeader>
              <TableRow>
                <TableHead class="w-20">
                  {{ t('pages.organizationRoomModeration.columns.id') }}
                </TableHead>
                <TableHead class="w-[42%]">
                  {{ t('pages.organizationRoomModeration.columns.title') }}
                </TableHead>
                <TableHead class="w-[22%]">
                  {{ t('pages.organizationRoomModeration.columns.owner') }}
                </TableHead>
                <TableHead class="w-[16%]">
                  {{ t('pages.organizationRoomModeration.columns.price') }}
                </TableHead>
                <TableHead class="w-[20%]">
                  {{ t('pages.organizationRoomModeration.columns.status') }}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow
                v-for="room in rooms"
                :key="room.id"
                class="cursor-pointer"
                :class="selectedRoomId === room.id ? 'bg-muted/60' : ''"
                @click="selectedRoomId = room.id"
              >
                <TableCell class="whitespace-nowrap">#{{ room.id }}</TableCell>
                <TableCell class="align-top">
                  <div class="line-clamp-2 break-words font-medium">
                    {{ room.title }}
                  </div>
                  <div class="line-clamp-2 break-words text-xs text-muted-foreground">
                    {{ room.address || room.slug }}
                  </div>
                </TableCell>
                <TableCell class="align-top">
                  <div class="line-clamp-2 break-words">
                    {{
                      room.owner?.profile?.full_name ||
                      room.owner?.username ||
                      room.owner?.email ||
                      t('common.notAvailable')
                    }}
                  </div>
                </TableCell>
                <TableCell class="whitespace-nowrap">
                  {{ formatMoney(room.price) }}
                </TableCell>
                <TableCell class="whitespace-nowrap">
                  <Badge :variant="statusVariant(room.post_status) as any">
                    {{ statusLabel(room.post_status) }}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div
            v-if="meta"
            class="mt-4 flex items-center justify-between"
          >
            <div class="text-sm text-muted-foreground">
              {{
                t('pages.organizationRoomModeration.totalText', {
                  total: meta.total,
                  current: meta.current_page,
                  last: meta.last_page,
                })
              }}
            </div>

            <div class="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                :disabled="filters.page <= 1"
                @click="filters.page -= 1"
              >
                {{ t('pages.organizationRoomModeration.previousPage') }}
              </Button>
              <Button
                variant="outline"
                size="sm"
                :disabled="filters.page >= meta.last_page"
                @click="filters.page += 1"
              >
                {{ t('pages.organizationRoomModeration.nextPage') }}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="xl:col-span-2">
        <CardHeader>
          <CardTitle>
            {{ t('pages.organizationRoomModeration.detailsTitle') }}
          </CardTitle>
        </CardHeader>
        <CardContent
          v-if="selectedRoom"
          class="space-y-4"
        >
          <img
            :src="getCover(selectedRoom)"
            class="h-60 w-full rounded-xl border object-cover"
          />

          <div class="space-y-2">
            <div class="flex items-center justify-between gap-2">
              <h3 class="text-lg font-semibold">{{ selectedRoom.title }}</h3>
              <Badge :variant="statusVariant(selectedRoom.post_status) as any">
                {{ statusLabel(selectedRoom.post_status) }}
              </Badge>
            </div>

            <div class="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin class="mt-0.5 h-4 w-4" />
              <span>
                {{
                  selectedRoom.address ||
                  t('pages.organizationRoomModeration.noAddress')
                }}
              </span>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <Wallet class="h-4 w-4" />
              <span>
                {{ formatMoney(selectedRoom.price) }}
                {{ t('pages.organizationRoomModeration.perMonth') }}
              </span>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <UserRound class="h-4 w-4" />
              <span>
                {{
                  selectedRoom.owner?.profile?.full_name ||
                  selectedRoom.owner?.username ||
                  t('common.notAvailable')
                }}
              </span>
            </div>

            <div
              v-if="selectedRoom.owner?.profile?.phone_number"
              class="flex items-center gap-2 text-sm"
            >
              <Phone class="h-4 w-4" />
              <span>{{ selectedRoom.owner?.profile?.phone_number }}</span>
            </div>

            <div
              v-if="selectedRoom.owner?.email"
              class="flex items-center gap-2 text-sm"
            >
              <Mail class="h-4 w-4" />
              <span>{{ selectedRoom.owner?.email }}</span>
            </div>
          </div>

          <div class="rounded-lg border p-3">
            <div class="mb-2 text-sm font-medium">
              {{ t('pages.organizationRoomModeration.descriptionLabel') }}
            </div>
            <div class="whitespace-pre-line text-sm text-muted-foreground">
              {{
                selectedRoom.description ||
                t('pages.organizationRoomModeration.emptyDescription')
              }}
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">
              {{ t('pages.organizationRoomModeration.moderationNote') }}
            </label>
            <Textarea
              v-model="moderationNote"
              rows="5"
              :placeholder="t('pages.organizationRoomModeration.moderationNotePlaceholder')"
            />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <Button
              :disabled="mutateStatus.isPending.value"
              @click="applyStatus('approved')"
            >
              <CheckCircle2 class="mr-2 h-4 w-4" />
              {{ t('pages.organizationRoomModeration.approve') }}
            </Button>

            <Button
              variant="destructive"
              :disabled="mutateStatus.isPending.value"
              @click="applyStatus('rejected')"
            >
              <XCircle class="mr-2 h-4 w-4" />
              {{ t('pages.organizationRoomModeration.reject') }}
            </Button>

            <Button
              variant="outline"
              :disabled="mutateStatus.isPending.value"
              @click="applyStatus('hidden')"
            >
              <EyeOff class="mr-2 h-4 w-4" />
              {{ t('pages.organizationRoomModeration.hideListing') }}
            </Button>

            <Button
              variant="secondary"
              :disabled="mutateStatus.isPending.value"
              @click="applyStatus('pending')"
            >
              <Clock3 class="mr-2 h-4 w-4" />
              {{ t('pages.organizationRoomModeration.moveToPending') }}
            </Button>
          </div>

          <Button
            variant="ghost"
            class="w-full"
            :disabled="roomsQuery.isFetching.value"
            @click="roomsQuery.refetch()"
          >
            <RefreshCcw class="mr-2 h-4 w-4" />
            {{ t('pages.organizationRoomModeration.reloadData') }}
          </Button>
        </CardContent>

        <CardContent v-else>
          <div class="py-10 text-center text-sm text-muted-foreground">
            {{ t('pages.organizationRoomModeration.selectListingPrompt') }}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
