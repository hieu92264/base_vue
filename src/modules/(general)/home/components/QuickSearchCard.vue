<template>
  <Card class="border-0 bg-transparent shadow-none">
    <CardContent class="p-4 md:p-6">
      <!-- Header -->
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

      <!-- Row 1 -->
      <div class="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div class="md:col-span-5">
          <Label
            for=""
            class="mb-1.5! block text-xs text-muted-foreground"
            >Từ khoá</Label
          >
          <Input
            v-model="form.keyword"
            class="h-11! rounded-2xl border-border/60 bg-background/60 focus-visible:ring-2 focus-visible:ring-primary/30"
            placeholder="VD: phòng trọ, căn hộ..."
          />
        </div>

        <div class="md:col-span-2">
          <Label
            for=""
            class="mb-1.5! block text-xs text-muted-foreground"
            >Thành phố</Label
          >
          <Select
            :model-value="selectValue(form.city_id)"
            @update:model-value="emitChangeCity"
          >
            <SelectTrigger
              class="h-11! rounded-2xl border-border/60 bg-background/60 focus:ring-2 focus:ring-primary/30"
            >
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent class="rounded-2xl">
              <SelectItem :value="ALL">Tất cả</SelectItem>
              <SelectItem
                v-for="c in cities"
                :key="c.id"
                :value="String(c.id)"
              >
                {{ c.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="md:col-span-2">
          <Label class="mb-1.5! block text-xs text-muted-foreground"
            >Quận/Huyện</Label
          >
          <Select
            :model-value="selectValue(form.district_id)"
            :disabled="!form.city_id"
            @update:model-value="emitChangeDistrict"
          >
            <SelectTrigger
              class="h-11! rounded-2xl border-border/60 bg-background/60 focus:ring-2 focus:ring-primary/30"
            >
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent class="rounded-2xl">
              <SelectItem :value="ALL">Tất cả</SelectItem>
              <SelectItem
                v-for="d in districts"
                :key="d.id"
                :value="String(d.id)"
              >
                {{ d.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="md:col-span-3">
          <Label class="mb-1.5! block text-xs text-muted-foreground"
            >Phường/Xã</Label
          >
          <Select
            :model-value="selectValue(form.ward_id)"
            :disabled="!form.district_id"
            @update:model-value="(v) => (form.ward_id = normalizeId(v))"
          >
            <SelectTrigger
              class="h-11! rounded-2xl border-border/60 bg-background/60 focus:ring-2 focus:ring-primary/30"
            >
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent class="rounded-2xl">
              <SelectItem :value="ALL">Tất cả</SelectItem>
              <SelectItem
                v-for="w in wards"
                :key="w.id"
                :value="String(w.id)"
              >
                {{ w.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <!-- Divider -->
      <div class="my-5! h-px w-full bg-border/60" />

      <!-- Row 2 -->
      <div class="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div class="md:col-span-3">
          <Label class="mb-1.5! block text-xs text-muted-foreground"
            >Giá từ (VND)</Label
          >
          <Input
            v-model.number="form.min_price"
            class="h-11! rounded-2xl border-border/60 bg-background/60 focus-visible:ring-2 focus-visible:ring-primary/30"
            type="number"
            placeholder="0"
          />
        </div>

        <div class="md:col-span-3">
          <Label class="mb-1.5! block text-xs text-muted-foreground"
            >Giá đến (VND)</Label
          >
          <Input
            v-model.number="form.max_price"
            class="h-11! rounded-2xl border-border/60 bg-background/60 focus-visible:ring-2 focus-visible:ring-primary/30"
            type="number"
            placeholder="15000000"
          />
        </div>

        <div class="md:col-span-3">
          <Label class="mb-1.5! block text-xs text-muted-foreground"
            >Diện tích từ (m²)</Label
          >
          <Input
            v-model.number="form.min_area"
            class="h-11! rounded-2xl border-border/60 bg-background/60 focus-visible:ring-2 focus-visible:ring-primary/30"
            type="number"
            placeholder="0"
          />
        </div>

        <div class="md:col-span-3">
          <Label class="mb-1.5! block text-xs text-muted-foreground"
            >Diện tích đến (m²)</Label
          >
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
import type { ICity, IDistrict, IWard } from '@/common/types/entities'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { reactive } from 'vue'

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

defineProps<{
  cities: ICity[]
  districts: IDistrict[]
  wards: IWard[]
  loading?: boolean
}>()

const ALL = '__all__'

const emit = defineEmits<{
  (e: 'change-city', cityId: number | ''): void
  (e: 'change-district', districtId: number | ''): void
  (e: 'search', payload: SearchPayload): void
}>()

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

function reset() {
  form.keyword = ''
  form.city_id = ''
  form.district_id = ''
  form.ward_id = ''
  form.min_price = undefined
  form.max_price = undefined
  form.min_area = undefined
  form.max_area = undefined

  // nếu bạn muốn: reset xong tự search luôn
  // submit()
}

function emitChangeCity(v: unknown) {
  form.city_id = normalizeId(v)
  form.district_id = ''
  form.ward_id = ''
  emit('change-city', form.city_id)
}

function emitChangeDistrict(v: unknown) {
  form.district_id = normalizeId(v)
  form.ward_id = ''
  emit('change-district', form.district_id)
}

function submit() {
  emit('search', { ...form })
}
</script>
