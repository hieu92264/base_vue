<template>
  <div class="min-h-svh flex items-center justify-center p-6">
    <div
      class="max-w-md w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 text-center"
    >
      <h1 class="text-2xl font-bold text-zinc-950 dark:text-zinc-50">
        Kích hoạt thành công ✅
      </h1>
      <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập ngay bây giờ.
      </p>

      <RouterLink
        to="/login"
        class="inline-flex mt-5 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-black hover:text-white dark:hover:bg-zinc-100 dark:hover:text-black transition-colors"
      >
        Về trang đăng nhập
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
