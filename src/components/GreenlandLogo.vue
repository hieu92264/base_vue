<script setup lang="ts">
import { useSidebar } from '@/components/ui/sidebar'

const { state } = useSidebar()
</script>

<template>
  <div
    :class="[
      'flex items-center h-12 transition-all duration-300 ease-in-out',
      // Khi thu gọn: bỏ px-2 để icon có không gian, dùng justify-center để căn giữa
      state === 'collapsed' ? 'justify-center px-0' : 'px-2',
    ]"
  >
    <div
      class="flex aspect-square h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-primary text-primary-foreground font-bold shadow-sm"
    >
      GL
    </div>

    <div
      :class="[
        'flex flex-col justify-center transition-all duration-300 ease-in-out overflow-hidden',
        state === 'collapsed'
          ? 'w-0 opacity-0 ml-0'
          : 'w-auto opacity-100 ml-3',
      ]"
    >
      <span
        class="text-sm font-semibold leading-none tracking-tight my-1 whitespace-nowrap"
      >
        GREENLAND
      </span>
      <span
        class="text-[11px] leading-none text-muted-foreground font-medium whitespace-nowrap"
      >
        员工绩效评估表
      </span>
    </div>
  </div>
</template>
