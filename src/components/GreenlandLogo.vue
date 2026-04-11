<script setup lang="ts">
import { useSidebar } from '@/components/ui/sidebar'

const { state } = useSidebar()
</script>

<template>
  <div
    :class="[
      'flex w-full items-center transition-all duration-300 ease-in-out',
      'justify-center',
      state === 'collapsed' ? 'px-0 py-1' : 'px-3 py-2',
    ]"
  >
    <div
      :class="[
        'flex items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-white shadow-sm transition-all duration-300 ease-in-out',
        state === 'collapsed' ? 'h-12 w-12 p-1' : 'h-20 w-20 p-2',
      ]"
    >
      <img
        src="/images/logo.svg"
        alt="Application logo"
        :class="[
          'block h-full w-full object-contain transition-all duration-300 ease-in-out',
          state === 'collapsed' ? 'scale-95' : 'scale-100',
        ]"
      />
    </div>
  </div>
</template>
