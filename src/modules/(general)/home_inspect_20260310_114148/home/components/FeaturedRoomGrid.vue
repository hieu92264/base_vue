<template>
  <div
    v-if="isLoading"
    class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
  >
    <div
      v-for="n in 6"
      :key="n"
      class="overflow-hidden rounded-2xl border border-border/60 bg-card/70"
    >
      <div class="aspect-[4/3] animate-pulse bg-muted/50" />
      <div class="space-y-3 p-4">
        <div class="h-4 w-4/5 animate-pulse rounded bg-muted/60" />
        <div class="h-3 w-3/5 animate-pulse rounded bg-muted/45" />
        <div class="h-4 w-2/5 animate-pulse rounded bg-muted/60" />
      </div>
    </div>
  </div>

  <div
    v-else-if="!items.length"
    class="grid min-h-48 place-items-center rounded-2xl border border-dashed border-border/80 bg-card/40 px-4 text-center"
  >
    <div>
      <p class="text-base font-medium">Chua co phong noi bat</p>
      <p class="text-sm text-muted-foreground">
        Du lieu se duoc cap nhat trong thoi gian ngan.
      </p>
    </div>
  </div>

  <div
    v-else
    class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
  >
    <RoomCard
      v-for="r in items"
      :key="r.id"
      :room="r"
    />
  </div>
</template>

<script setup lang="ts">
import type { IRoom } from '@/common/types/entities'
import RoomCard from './RoomCard.vue'

defineProps<{
  items: IRoom[]
  isLoading?: boolean
}>()
</script>
