<template>
  <div
    :class="
      cn('flex items-center gap-3 transition-colors duration-300', props.class)
    "
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="text-emerald-600 dark:text-emerald-400 shrink-0"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle
        cx="9"
        cy="7"
        r="4"
      />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>

    <div class="flex flex-col font-bold leading-tight">
      <span class="text-xl tracking-tighter dark:text-slate-900 text-slate-50">
        GreenLand<span
          class="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-500/30 dark:decoration-emerald-400/50 decoration-2 underline-offset-4"
          >HRM</span
        >
      </span>

      <span
        class="text-[9px] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400/80"
      >
        Professional People Management
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>
