<script setup lang="ts">
import { computed } from 'vue'
import FeaturedRoomGrid from '@/modules/(general)/home/components/FeaturedRoomGrid.vue'
import HomeSlider from '@/modules/(general)/home/components/HomeSlider.vue'
import QuickSearchCard from '@/modules/(general)/home/components/QuickSearchCard.vue'
import {
  useCitiesQuery,
  useDistrictsQuery,
  useFeatureRoomsQuery,
  useSlidersQuery,
  useWardsQuery,
} from '@/modules/(general)/home/hooks/use-home'

const { data: sliders, isLoading: isLoadingSliders } = useSlidersQuery()
const { data: featuredRooms, isLoading: isLoadingFeaturedRooms } =
  useFeatureRoomsQuery()

const { data: cities, isLoading: isLoadingCities } = useCitiesQuery()
const { data: districts, isLoading: isLoadingDistricts } = useDistrictsQuery()
const { data: wards, isLoading: isLoadingWards } = useWardsQuery()

const sliderItems = computed(() => sliders.value ?? [])
const featuredItems = computed(() => featuredRooms.value ?? [])
const cityItems = computed(() => cities.value ?? [])
const districtItems = computed(() => districts.value ?? [])
const wardItems = computed(() => wards.value ?? [])

const isLoadingLocations = computed(
  () =>
    isLoadingCities.value || isLoadingDistricts.value || isLoadingWards.value,
)

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
  console.log('Search payload:', payload)

  // TODO:
  // router.push({ name: 'search', query: ...payload })
}
</script>

<template>
  <div class="min-h-screen pb-12">
    <section class="relative px-4 pt-4 md:px-6">
      <div
        class="pointer-events-none absolute inset-x-4 top-2 h-44 rounded-3xl bg-linear-to-r from-emerald-500/20 via-cyan-400/10 to-transparent blur-2xl md:inset-x-6"
      />

      <div class="mx-auto max-w-7xl">
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

    <section class="relative z-10 mt-4! max-w-7xl px-4 md:px-6">
      <div
        class="rounded-3xl border bg-background/60 p-1 shadow-2xl shadow-black/5 backdrop-blur supports-[backdrop-filter]:bg-background/40"
      >
        <div class="rounded-[1.35rem] bg-card/80 ring-1 ring-border/50">
          <QuickSearchCard
            :cities="cityItems"
            :districts="districtItems"
            :wards="wardItems"
            :loading="isLoadingLocations"
            @search="handleSearch"
          />
        </div>
      </div>
    </section>

    <section class="mx-auto mt-10 max-w-7xl px-4 md:px-6">
      <div class="mb-5 flex items-end justify-between gap-3">
        <div>
          <h2 class="text-2xl font-semibold tracking-tight md:text-3xl">
            Phong noi bat
          </h2>
          <p class="text-sm text-muted-foreground">
            Danh sach phong danh cho ban hom nay
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
