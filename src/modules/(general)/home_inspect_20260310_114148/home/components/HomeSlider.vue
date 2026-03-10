<template>
  <div class="relative h-[20rem] md:h-[28rem] overflow-hidden">
    <div
      v-if="isLoading"
      class="grid h-full place-items-center bg-muted/30 text-sm text-muted-foreground"
    >
      Dang tai slider...
    </div>

    <template v-else>
      <img
        v-if="activeItem"
        :src="displayImage(activeItem)"
        class="h-full w-full object-cover transition-transform duration-700 ease-out"
        @error="handleImageError"
      />

      <div
        class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"
      />
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(255,255,255,0.18),transparent_45%)]"
      />

      <div class="absolute inset-x-0 bottom-0">
        <div class="mx-auto max-w-7xl p-6 text-white md:p-10">
          <p class="mb-3 text-xs uppercase tracking-[0.24em] text-white/70">
            Greenland rental
          </p>
          <h1
            class="max-w-3xl text-3xl leading-tight font-semibold md:text-5xl"
          >
            {{
              activeItem?.title || 'Tim phong de dang, dat nhanh trong vai phut'
            }}
          </h1>
        </div>
      </div>

      <button
        v-if="sortedItems.length > 1"
        class="absolute left-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/45 bg-black/35 text-xl text-white transition hover:scale-105 hover:bg-black/60"
        type="button"
        @click="prev"
      >
        ‹
      </button>

      <button
        v-if="sortedItems.length > 1"
        class="absolute right-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/45 bg-black/35 text-xl text-white transition hover:scale-105 hover:bg-black/60"
        type="button"
        @click="next"
      >
        ›
      </button>

      <div
        v-if="sortedItems.length > 1"
        class="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2"
      >
        <button
          v-for="(_, i) in sortedItems"
          :key="i"
          type="button"
          :class="[
            'h-2.5 rounded-full transition-all',
            i === index
              ? 'w-8 bg-white'
              : 'w-2.5 bg-white/40 hover:bg-white/70',
          ]"
          @click="goTo(i)"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ISlider } from '@/common/types/entities'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
  items: ISlider[]
  isLoading: boolean
}>()

const sortedItems = computed(() => {
  return [...props.items].sort(
    (a, b) => (a.sort_order || 0) - (b.sort_order || 0),
  )
})

const index = ref(0)
const activeItem = computed(() => sortedItems.value[index.value] ?? null)
let timer: ReturnType<typeof setInterval> | null = null

function displayImage(item: ISlider) {
  if (item.image_url) {
    return item.image_url
  }

  return 'https://placehold.co/1600x800?text=No+Image'
}

function handleImageError(e: Event) {
  const target = e.target as HTMLImageElement
  target.src = 'https://placehold.co/1600x800?text=Image+Error'
}

function stopAuto() {
  if (timer) clearInterval(timer)
  timer = null
}

function next() {
  if (!sortedItems.value.length) return
  index.value = (index.value + 1) % sortedItems.value.length
}

function prev() {
  if (!sortedItems.value.length) return
  index.value =
    (index.value - 1 + sortedItems.value.length) % sortedItems.value.length
}

function goTo(i: number) {
  index.value = i
}

function startAuto() {
  stopAuto()
  if (sortedItems.value.length <= 1) return
  timer = setInterval(next, 4500)
}

watch(
  sortedItems,
  (items) => {
    if (!items.length) {
      index.value = 0
      stopAuto()
      return
    }

    if (index.value > items.length - 1) index.value = 0
    startAuto()
  },
  { immediate: true },
)

onMounted(startAuto)
onUnmounted(stopAuto)
</script>
