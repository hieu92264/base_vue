<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div
    class="bg-white h-screen flex flex-col items-center justify-center text-center px-4"
  >
    <h1 class="text-9xl font-bold text-primary">404</h1>
    <p class="text-2xl font-semibold mt-4">Ối! Trang này không tồn tại.</p>
    <p class="text-muted-foreground mt-2 mb-8">
      Có vẻ như bạn đã nhập sai địa chỉ hoặc trang đã bị di chuyển.
    </p>
    <div class="flex gap-4">
      <Button
        variant="outline"
        @click="router.back()"
        >Quay lại</Button
      >

      <Button @click="router.push({ name: 'home' })">Về trang chủ</Button>
    </div>
  </div>
</template>
