<script setup lang="ts">
import type { IRoomPhoto } from '@/common/types/entities'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Trash2, Star, ArrowUp, ArrowDown, Upload } from 'lucide-vue-next'
import { ref } from 'vue'

const props = defineProps<{
  photos: IRoomPhoto[]
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'upload', files: FileList): void
  (e: 'set-cover', photo: IRoomPhoto): void
  (e: 'delete', photo: IRoomPhoto): void
  (e: 'sort-up', photo: IRoomPhoto): void
  (e: 'sort-down', photo: IRoomPhoto): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)

const handleChooseFiles = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    emit('upload', target.files)
  }
  target.value = ''
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="font-semibold">Ảnh phòng</h3>
        <p class="text-sm text-muted-foreground">
          Upload ảnh, chọn ảnh cover, đổi thứ tự, xóa ảnh
        </p>
      </div>

      <div>
        <Input
          ref="fileInput"
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.avif"
          class="max-w-[260px]"
          :disabled="disabled"
          @change="handleChooseFiles"
        />
      </div>
    </div>

    <div
      v-if="photos.length === 0"
      class="rounded-lg border border-dashed p-6 text-sm text-muted-foreground"
    >
      Chưa có ảnh nào.
    </div>

    <div
      v-else
      class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="rounded-xl border p-3 space-y-3"
      >
        <img
          :src="photo.photo_url || 'https://placehold.co/600x400?text=No+Image'"
          class="h-44 w-full rounded-lg border object-cover"
        />

        <div class="flex items-center justify-between">
          <Badge v-if="photo.is_cover">Ảnh cover</Badge>
          <span
            v-else
            class="text-sm text-muted-foreground"
            >Ảnh thường</span
          >

          <span class="text-xs text-muted-foreground">
            sort: {{ photo.sort_order }}
          </span>
        </div>

        <div class="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            :disabled="disabled || photo.is_cover"
            @click="$emit('set-cover', photo)"
          >
            <Star class="mr-2 h-4 w-4" />
            Đặt cover
          </Button>

          <Button
            size="sm"
            variant="outline"
            :disabled="disabled"
            @click="$emit('sort-up', photo)"
          >
            <ArrowUp class="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            :disabled="disabled"
            @click="$emit('sort-down', photo)"
          >
            <ArrowDown class="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="destructive"
            :disabled="disabled"
            @click="$emit('delete', photo)"
          >
            <Trash2 class="mr-2 h-4 w-4" />
            Xóa
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
