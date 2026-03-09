<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QuickSearchCard from './QuickSearchCard.vue'
import FeaturedRoomGrid from './FeaturedRoomGrid.vue'
import { Button } from '@/components/ui/button'
import {
  useCitiesQuery,
  useDistrictsQuery,
  useRoomsQuery,
  useWardsQuery,
} from '../hooks/use-home'

function parseQueryNumber(value: unknown): number | undefined {
  if (typeof value !== 'string' || value.trim() === '') return undefined
  const num = Number(value)
  return Number.isNaN(num) ? undefined : num
}

function parseQueryNumberOrEmpty(value: unknown): number | '' {
  if (typeof value !== 'string' || value.trim() === '') return ''
  const num = Number(value)
  return Number.isNaN(num) ? '' : num
}

const route = useRoute()
const router = useRouter()

const { data: cities } = useCitiesQuery()
const { data: districts } = useDistrictsQuery()
const { data: wards } = useWardsQuery()

const searchParams = computed(() => ({
  keyword: typeof route.query.keyword === 'string' ? route.query.keyword : '',
  city_id: parseQueryNumberOrEmpty(route.query.city_id),
  district_id: parseQueryNumberOrEmpty(route.query.district_id),
  ward_id: parseQueryNumberOrEmpty(route.query.ward_id),
  min_price: parseQueryNumber(route.query.min_price),
  max_price: parseQueryNumber(route.query.max_price),
  min_area: parseQueryNumber(route.query.min_area),
  max_area: parseQueryNumber(route.query.max_area),
  sort: typeof route.query.sort === 'string' ? route.query.sort : 'latest',
  page: parseQueryNumber(route.query.page) ?? 1,
  per_page: 9,
}))

const { data, isLoading, isFetching } = useRoomsQuery(searchParams)

const rooms = computed(() => data.value?.data ?? [])
const meta = computed(() => data.value?.meta)

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
      sort: String(searchParams.value.sort || 'latest'),
      page: '1',
    },
  })
}

function changeSort(sort: string) {
  router.push({
    name: 'general.rooms',
    query: {
      ...route.query,
      sort,
      page: '1',
    },
  })
}

function goPage(page: number) {
  router.push({
    name: 'general.rooms',
    query: {
      ...route.query,
      page: String(page),
    },
  })
}
</script>

<template>
  <div class="min-h-screen px-4 py-6 md:px-6">
    <div class="mx-auto! max-w-7xl! space-y-6">
      <div class="rounded-3xl border bg-card/70 shadow-sm">
        <QuickSearchCard
          :cities="cities ?? []"
          :districts="districts ?? []"
          :wards="wards ?? []"
          @search="handleSearch"
        />
      </div>

      <div
        class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 class="text-2xl font-semibold">Danh sách phòng</h1>
          <p class="text-sm text-muted-foreground">
            {{ meta?.total ?? 0 }} kết quả
          </p>
        </div>

        <select
          :value="searchParams.sort"
          class="h-10 rounded-xl border border-border bg-background px-3 text-sm"
          @change="changeSort(($event.target as HTMLSelectElement).value)"
        >
          <option value="latest">Mới nhất</option>
          <option value="price_asc">Giá tăng dần</option>
          <option value="price_desc">Giá giảm dần</option>
          <option value="area_asc">Diện tích tăng dần</option>
          <option value="area_desc">Diện tích giảm dần</option>
        </select>
      </div>

      <FeaturedRoomGrid
        :items="rooms"
        :is-loading="isLoading || isFetching"
      />

      <div
        v-if="meta && meta.last_page > 1"
        class="flex items-center justify-center gap-2 pt-2"
      >
        <Button
          variant="outline"
          :disabled="meta.current_page <= 1"
          @click="goPage(meta.current_page - 1)"
        >
          Trước
        </Button>

        <div class="text-sm text-muted-foreground">
          Trang {{ meta.current_page }} / {{ meta.last_page }}
        </div>

        <Button
          variant="outline"
          :disabled="meta.current_page >= meta.last_page"
          @click="goPage(meta.current_page + 1)"
        >
          Sau
        </Button>
      </div>
    </div>
  </div>
</template>
