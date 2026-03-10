<template>
  <Card class="border-0 bg-transparent shadow-none">
    <CardContent class="p-4 md:p-6">
      <div class="mb-4! flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 class="text-lg font-semibold tracking-tight">
            Tìm nhanh phòng phù hợp
          </h3>
          <p class="mt-1 text-sm text-muted-foreground">
            Lọc theo khu vực, giá và diện tích để có kết quả chính xác hơn
          </p>
        </div>

        <div class="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            class="h-9 rounded-xl px-3 text-muted-foreground hover:text-foreground"
            @click="reset"
          >
            Xoá lọc
          </Button>

          <Button
            type="button"
            class="h-9 rounded-xl px-4 shadow-lg shadow-primary/20 transition hover:brightness-110"
            :disabled="loading"
            @click="submit"
          >
            {{ loading ? 'Đang tải…' : 'Tìm kiếm' }}
          </Button>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div class="md:col-span-5">
          <Label class="mb-1.5! block text-xs text-muted-foreground">
            Từ khoá
          </Label>
          <Input
            v-model="form.keyword"
            class="h-11! rounded-2xl border-border/60 bg-background/60 focus-visible:ring-2 focus-visible:ring-primary/30"
            placeholder="VD: phòng trọ, căn hộ..."
          />
        </div>

        <div class="md:col-span-2">
          <Label class="mb-1.5! block text-xs text-muted-foreground">
            Thành phố
          </Label>
          <select
            :value="selectValue(form.city_id)"
            class="h-11 w-full rounded-2xl border border-border/60 bg-background/60 px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
            @change="onCityChange"
          >
            <option :value="ALL">Tất cả</option>
            <option
              v-for="c in cities"
              :key="c.id"
              :value="String(c.id)"
            >
              {{ c.name }}
            </option>
          </select>
        </div>

        <div class="md:col-span-2">
          <Label class="mb-1.5! block text-xs text-muted-foreground">
            Quận/Huyện
          </Label>
          <select
            :value="selectValue(form.district_id)"
            :disabled="!form.city_id"
            class="h-11 w-full rounded-2xl border border-border/60 bg-background/60 px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
            @change="onDistrictChange"
          >
            <option :value="ALL">Tất cả</option>
            <option
              v-for="d in filteredDistricts"
              :key="d.id"
              :value="String(d.id)"
            >
              {{ d.name }}
            </option>
          </select>
        </div>

        <div class="md:col-span-3">
          <Label class="mb-1.5! block text-xs text-muted-foreground">
            Phường/Xã
          </Label>
          <select
            :value="selectValue(form.ward_id)"
            :disabled="!form.district_id"
            class="h-11 w-full rounded-2xl border border-border/60 bg-background/60 px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
            @change="onWardChange"
          >
            <option :value="ALL">Tất cả</option>
            <option
              v-for="w in filteredWards"
              :key="w.id"
              :value="String(w.id)"
            >
              {{ w.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="my-5! h-px w-full bg-border/60" />

      <div class="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div class="md:col-span-3">
          <Label class="mb-1.5! block text-xs text-muted-foreground">
            Giá từ (VND)
          </Label>
          <Input
            v-model.number="form.min_price"
            class="h-11! rounded-2xl border-border/60 bg-background/60 focus-visible:ring-2 focus-visible:ring-primary/30"
            type="number"
            placeholder="0"
          />
        </div>

        <div class="md:col-span-3">
          <Label class="mb-1.5! block text-xs text-muted-foreground">
            Giá đến (VND)
          </Label>
          <Input
            v-model.number="form.max_price"
            class="h-11! rounded-2xl border-border/60 bg-background/60 focus-visible:ring-2 focus-visible:ring-primary/30"
            type="number"
            placeholder="15000000"
          />
        </div>

        <div class="md:col-span-3">
          <Label class="mb-1.5! block text-xs text-muted-foreground">
            Diện tích từ (m²)
          </Label>
          <Input
            v-model.number="form.min_area"
            class="h-11! rounded-2xl border-border/60 bg-background/60 focus-visible:ring-2 focus-visible:ring-primary/30"
            type="number"
            placeholder="0"
          />
        </div>

        <div class="md:col-span-3">
          <Label class="mb-1.5! block text-xs text-muted-foreground">
            Diện tích đến (m²)
          </Label>
          <Input
            v-model.number="form.max_area"
            class="h-11! rounded-2xl border-border/60 bg-background/60 focus-visible:ring-2 focus-visible:ring-primary/30"
            type="number"
            placeholder="120"
          />
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { ICity, IDistrict, IWard } from '@/common/types/entities'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type SearchPayload = {
  keyword: string
  city_id: number | ''
  district_id: number | ''
  ward_id: number | ''
  min_price?: number
  max_price?: number
  min_area?: number
  max_area?: number
}

const props = defineProps<{
  cities: ICity[]
  districts: IDistrict[]
  wards: IWard[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'search', payload: SearchPayload): void
}>()

const ALL = '__all__'

const form = reactive<SearchPayload>({
  keyword: '',
  city_id: '',
  district_id: '',
  ward_id: '',
  min_price: undefined,
  max_price: undefined,
  min_area: undefined,
  max_area: undefined,
})

function normalizeId(v: unknown): number | '' {
  if (v === ALL || v === '' || v === null || v === undefined) return ''
  const n = Number(v)
  return Number.isFinite(n) ? n : ''
}

function selectValue(v: number | '') {
  return v === '' ? ALL : String(v)
}

const filteredDistricts = computed(() => {
  if (!form.city_id) return []
  return props.districts.filter((d) => d.city_id === form.city_id)
})

const filteredWards = computed(() => {
  if (!form.district_id) return []
  return props.wards.filter((w) => w.district_id === form.district_id)
})

function onCityChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  form.city_id = normalizeId(value)
  form.district_id = ''
  form.ward_id = ''
}

function onDistrictChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  form.district_id = normalizeId(value)
  form.ward_id = ''
}

function onWardChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  form.ward_id = normalizeId(value)
}

function reset() {
  form.keyword = ''
  form.city_id = ''
  form.district_id = ''
  form.ward_id = ''
  form.min_price = undefined
  form.max_price = undefined
  form.min_area = undefined
  form.max_area = undefined
}

function submit() {
  emit('search', { ...form })
}
</script>
