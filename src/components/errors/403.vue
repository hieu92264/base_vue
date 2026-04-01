<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="h-svh">
    <div
      class="m-auto flex h-full w-full flex-col items-center justify-center gap-2"
    >
      <h1 class="text-[7rem] leading-tight font-bold">403</h1>
      <span class="font-medium">Truy cập bị từ chối</span>
      <p class="text-center text-muted-foreground">
        Bạn không có quyền cần thiết <br />
        để xem tài nguyên này.
      </p>
      <div class="mt-6 flex gap-4">
        <Button
          variant="outline"
          @click="router.back()"
        >
          Quay lại
        </Button>
        <Button @click="router.push({ name: 'dashboard' })">
          Về trang chủ
        </Button>
      </div>
    </div>
  </div>
</template>
