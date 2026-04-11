<script lang="ts">
export const description =
  'A two column forgot password page with a cover image.'
</script>

<script setup lang="ts">
import ForgotPasswordForm from '@/modules/(auth)/forgot-password/components/ForgotPasswordForm.vue'
</script>

<template>
  <div class="grid min-h-svh lg:grid-cols-2">
    <div class="dark:bg-black bg-white flex flex-col gap-6 p-6 md:p-10">
      <div class="flex justify-center md:justify-start">
        <div class="inline-flex items-center gap-3 rounded-full border border-border/60 bg-background/80 px-4 py-2 shadow-sm backdrop-blur">
          <div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white p-1.5 shadow-sm">
            <img
              src="/images/logo.svg"
              alt="GreenLand"
              class="h-full w-full object-contain"
            />
          </div>
          <div class="leading-tight">
            <p class="text-sm font-semibold text-foreground">GreenLand</p>
            <p class="text-xs text-muted-foreground">
              Ứng dụng quản lý cho thuê phòng trọ
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-xs">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>

    <div class="dark:bg-white bg-black relative hidden overflow-hidden lg:flex items-center justify-center">
      <div class="absolute h-72 w-72 rounded-full bg-emerald-500/10 blur-[120px]"></div>
      <div class="absolute h-64 w-64 rounded-full bg-sky-500/10 blur-[120px]"></div>

      <div class="relative z-10 flex max-w-xl flex-col items-center gap-6 px-10 text-center">
        <div class="flex h-36 w-36 items-center justify-center rounded-[2rem] bg-white/95 p-5 shadow-2xl ring-1 ring-black/5">
          <img
            src="/images/logo.svg"
            alt="GreenLand"
            class="h-full w-full object-contain"
          />
        </div>

        <div class="space-y-3">
          <h2 class="text-4xl font-bold tracking-tight text-white dark:text-slate-900">
            GreenLand
          </h2>
          <p class="max-w-lg text-sm leading-7 text-zinc-300 dark:text-slate-500">
            Khôi phục quyền truy cập để tiếp tục quản lý phòng trọ, danh sách
            khách thuê và thông tin vận hành một cách thuận tiện.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
