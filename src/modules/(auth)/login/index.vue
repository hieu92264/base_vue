<script lang="ts">
export const description = 'A two column login page with a cover image.'
</script>

<script setup lang="ts">
import IconGreenLand from '@/components/icons/IconGreenLand.vue'
import LoginForm from '@/modules/(auth)/login/components/LoginForm.vue'
import { GalleryVerticalEnd } from 'lucide-vue-next'
</script>

<template>
  <div class="grid min-h-svh lg:grid-cols-2">
    <div class="flex flex-col gap-4 p-6 md:p-10">
      <div class="flex justify-center gap-2 md:justify-start">
        <a
          href="#"
          class="flex items-center gap-2 font-medium"
        >
          <div
            class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md"
          >
            <GalleryVerticalEnd class="size-4" />
          </div>
          GreenLand-HRM
        </a>
      </div>
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-xs">
          <LoginForm />
        </div>
      </div>
    </div>
    <div
      class="bg-white relative hidden lg:flex items-center justify-center overflow-hidden"
    >
      <div
        class="absolute h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]"
      ></div>

      <div class="relative z-10 flex flex-col items-center gap-6">
        <IconGreenLand class="scale-[2.5]" />

        <div class="mt-5! flex flex-col items-center gap-2">
          <p
            class="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em]"
          >
            Enterprise Solution
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
