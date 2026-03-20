<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import FeaturedRoomGrid from '@/modules/(general)/home/components/FeaturedRoomGrid.vue'
import HomeSlider from '@/modules/(general)/home/components/HomeSlider.vue'
import QuickSearchCard from '@/modules/(general)/home/components/QuickSearchCard.vue'
import {
  useCitiesQuery,
  useFeatureRoomsQuery,
  useSlidersQuery,
} from '@/modules/(general)/home/hooks/use-home'

const router = useRouter()

const { data: sliders, isLoading: isLoadingSliders } = useSlidersQuery()
const { data: featuredRooms, isLoading: isLoadingFeaturedRooms } =
  useFeatureRoomsQuery()

const { data: cities, isLoading: isLoadingCities } = useCitiesQuery()

const sliderItems = computed(() => sliders.value ?? [])
const featuredItems = computed(() => featuredRooms.value ?? [])
const cityItems = computed(() => cities.value ?? [])

function handleSearch(payload: {
  keyword: string
  city_id: number | ''
  district_id: number | ''
  ward_id: number | ''
  min_price?: number
  max_price?: number
  min_area?: number
  max_area?: number
}) {
  router.push({
    name: 'general.rooms',
    query: {
      ...(payload.keyword ? { keyword: payload.keyword } : {}),
      ...(payload.city_id ? { city_id: String(payload.city_id) } : {}),
      ...(payload.district_id
        ? { district_id: String(payload.district_id) }
        : {}),
      ...(payload.ward_id ? { ward_id: String(payload.ward_id) } : {}),
      ...(payload.min_price != null
        ? { min_price: String(payload.min_price) }
        : {}),
      ...(payload.max_price != null
        ? { max_price: String(payload.max_price) }
        : {}),
      ...(payload.min_area != null
        ? { min_area: String(payload.min_area) }
        : {}),
      ...(payload.max_area != null
        ? { max_area: String(payload.max_area) }
        : {}),
      page: '1',
    },
  })
}
</script>

<template>
  <div class="min-h-screen pb-12">
    <section class="relative px-4 pt-4 md:px-6">
      <div
        class="pointer-events-none absolute inset-x-4 top-2 h-44 rounded-3xl bg-linear-to-r from-emerald-500/20 via-cyan-400/10 to-transparent blur-2xl md:inset-x-6"
      />

      <div class="mx-auto! max-w-7xl!">
        <div
          class="relative overflow-hidden rounded-3xl border border-border/60 bg-muted/40 shadow-2xl"
        >
          <HomeSlider
            :items="sliderItems"
            :is-loading="isLoadingSliders"
          />
        </div>
      </div>
    </section>

    <section class="relative z-10 mt-4! px-4 md:px-6">
      <div class="mx-auto! max-w-7xl!">
        <div
          class="rounded-3xl border bg-background/60 p-1 shadow-2xl shadow-black/5 backdrop-blur supports-[backdrop-filter]:bg-background/40"
        >
          <div class="rounded-[1.35rem] bg-card/80 ring-1 ring-border/50">
            <QuickSearchCard
              :cities="cityItems"
              :loading="isLoadingCities"
              @search="handleSearch"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto! mt-10 max-w-7xl! px-4 md:px-6">
      <div class="mb-5 flex items-end justify-between gap-3">
        <div>
          <h2 class="text-2xl font-semibold tracking-tight md:text-3xl">
            Phòng nổi bật
          </h2>
          <p class="text-sm text-muted-foreground">
            Danh sách phòng nổi bật dành cho bạn hôm nay
          </p>
        </div>
      </div>

      <FeaturedRoomGrid
        :items="featuredItems"
        :is-loading="isLoadingFeaturedRooms"
      />
    </section>
  </div>
</template>
