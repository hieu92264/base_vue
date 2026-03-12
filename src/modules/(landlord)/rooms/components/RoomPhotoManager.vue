<script setup lang="ts">
import { computed, ref } from 'vue'
import type { IRoomPhoto } from '@/common/types/entities'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Trash2,
  Star,
  ArrowUp,
  ArrowDown,
  Upload,
  ImagePlus,
} from 'lucide-vue-next'

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
const isDragging = ref(false)
const imageErrors = ref<Record<number, boolean>>({})

const sortedPhotos = computed(() =>
  [...props.photos].sort((a, b) => {
    if (a.is_cover !== b.is_cover) return a.is_cover ? -1 : 1
    return a.sort_order - b.sort_order
  }),
)

const openPicker = () => {
  if (props.disabled) return
  fileInput.value?.click()
}

const handleChooseFiles = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    emit('upload', target.files)
  }
  target.value = ''
}

const onDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false

  if (props.disabled) return

  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    emit('upload', files)
  }
}

const onDragOver = (e: DragEvent) => {
  e.preventDefault()
  if (!props.disabled) isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const handleImageError = (photoId: number) => {
  imageErrors.value[photoId] = true
}

const handleImageLoad = (photoId: number) => {
  imageErrors.value[photoId] = false
}

const getImageSrc = (photo: IRoomPhoto) => {
  if (imageErrors.value[photo.id]) {
    return 'https://placehold.co/600x400?text=Image+Loading'
  }
  return photo.photo_url || 'https://placehold.co/600x400?text=No+Image'
}
</script>

<template>
  <div class="space-y-4">
    <div
      class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
    >
      <div>
        <h3 class="font-semibold">Ảnh phòng</h3>
        <p class="text-sm text-muted-foreground">
          Upload ảnh, kéo thả file, chọn ảnh cover, đổi thứ tự, xóa ảnh
        </p>
      </div>

      <div class="flex items-center gap-2">
        <Input
          ref="fileInput"
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.avif"
          class="hidden"
          :disabled="disabled"
          @change="handleChooseFiles"
        />

        <Button
          type="button"
          :disabled="disabled"
          @click="openPicker"
        >
          <Upload class="mr-2 h-4 w-4" />
          Chọn ảnh
        </Button>
      </div>
    </div>

    <div
      class="rounded-2xl border border-dashed p-6 transition"
      :class="isDragging ? 'border-primary bg-primary/5' : 'border-muted'"
      @drop="onDrop"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
    >
      <div class="flex flex-col items-center justify-center gap-3 text-center">
        <div class="rounded-full border p-3">
          <ImagePlus class="h-6 w-6" />
        </div>

        <div>
          <div class="font-medium">Kéo & thả ảnh vào đây</div>
          <div class="text-sm text-muted-foreground">
            hoặc bấm nút <span class="font-medium">Chọn ảnh</span> để upload
          </div>
        </div>

        <div class="text-xs text-muted-foreground">
          Hỗ trợ JPG, PNG, WEBP, AVIF. Tối đa 5MB / ảnh.
        </div>
      </div>
    </div>

    <div
      v-if="sortedPhotos.length === 0"
      class="rounded-lg border border-dashed p-6 text-sm text-muted-foreground"
    >
      Chưa có ảnh nào.
    </div>

    <div
      v-else
      class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <div
        v-for="photo in sortedPhotos"
        :key="photo.id"
        class="space-y-3 rounded-2xl border bg-background p-3 shadow-sm"
      >
        <div class="relative overflow-hidden rounded-xl border">
          <img
            :src="getImageSrc(photo)"
            class="h-48 w-full object-cover"
            @error="handleImageError(photo.id)"
            @load="handleImageLoad(photo.id)"
          />

          <div class="absolute left-3 top-3 flex gap-2">
            <Badge v-if="photo.is_cover">Ảnh cover</Badge>
            <Badge
              v-if="photo.id < 0"
              variant="secondary"
            >
              Đang upload
            </Badge>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">
            {{ photo.is_cover ? 'Ảnh đại diện' : 'Ảnh thường' }}
          </span>

          <span class="text-xs text-muted-foreground">
            sort: {{ photo.sort_order }}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            :disabled="disabled || photo.is_cover || photo.id < 0"
            @click="$emit('set-cover', photo)"
          >
            <Star class="mr-2 h-4 w-4" />
            Đặt cover
          </Button>

          <Button
            size="sm"
            variant="destructive"
            :disabled="disabled || photo.id < 0"
            @click="$emit('delete', photo)"
          >
            <Trash2 class="mr-2 h-4 w-4" />
            Xóa
          </Button>

          <Button
            size="sm"
            variant="outline"
            :disabled="disabled || photo.id < 0"
            @click="$emit('sort-up', photo)"
          >
            <ArrowUp class="mr-2 h-4 w-4" />
            Lên
          </Button>

          <Button
            size="sm"
            variant="outline"
            :disabled="disabled || photo.id < 0"
            @click="$emit('sort-down', photo)"
          >
            <ArrowDown class="mr-2 h-4 w-4" />
            Xuống
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
