<script setup lang="ts">
import type { IRoom } from '@/common/types/entities'
import { Card, CardContent } from '@/components/ui/card'
import { computed } from 'vue'

const props = defineProps<{ room: IRoom }>()

const thumb = computed(() => {
  const photos = props.room.photos ?? []
  if (!photos.length) return ''

  const cover = photos.find((p) => p?.is_cover)
  if (cover?.photo_url) return cover.photo_url

  const sorted = [...photos].sort(
    (a, b) => Number(a?.sort_order ?? 9999) - Number(b?.sort_order ?? 9999),
  )

  return sorted[0]?.photo_url ?? photos[0]?.photo_url ?? ''
})

const locationText = computed(() => {
  const city = props.room.city?.name
  const district = props.room.district?.name
  const ward = props.room.ward?.name

  if (props.room.address) return props.room.address
  return (
    [ward, district, city].filter(Boolean).join(', ') || 'Vi tri dang cap nhat'
  )
})

function formatMoney(v: unknown) {
  const n = Number(v ?? 0)
  return Number.isFinite(n) ? n.toLocaleString('vi-VN') : '0'
}

function formatArea(v: unknown) {
  const n = Number(v ?? 0)
  return Number.isFinite(n)
    ? n.toLocaleString('vi-VN', { maximumFractionDigits: 1 })
    : '0'
}
</script>

<template>
  <RouterLink
    :to="`/rooms/${room.slug || room.id}`"
    class="group block"
  >
    <Card
      class="overflow-hidden rounded-2xl border-border/60 bg-card/80 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div class="relative aspect-4/3 overflow-hidden bg-muted">
        <img
          v-if="thumb"
          :src="thumb"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          alt="room"
        />
        <div
          v-else
          class="grid h-full w-full place-items-center text-sm text-muted-foreground"
        >
          Khong co hinh anh
        </div>

        <div
          class="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/55 to-transparent"
        />
        <div
          class="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white"
        >
          Featured
        </div>
      </div>

      <CardContent class="space-y-2.5 p-4">
        <h3
          class="line-clamp-2 text-base leading-snug font-semibold tracking-tight"
        >
          {{ room.title }}
        </h3>

        <p class="line-clamp-1 text-sm text-muted-foreground">
          {{ locationText }}
        </p>

        <div class="pt-1">
          <div class="flex items-end justify-between gap-3">
            <p class="text-lg font-semibold text-primary">
              {{ formatMoney(room.price) }}
              <span class="text-xs font-normal text-muted-foreground"
                >/thang</span
              >
            </p>
            <p class="text-sm text-muted-foreground">
              {{ formatArea(room.area) }} m2
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </RouterLink>
</template>
