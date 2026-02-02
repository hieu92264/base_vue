<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  containerClass?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    data-slot="table-container"
    :class="
      cn(
        'relative w-full overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50',
        props.containerClass,
      )
    "
  >
    <table
      data-slot="table"
      :class="cn('w-full caption-bottom text-sm table-fixed', props.class)"
    >
      <slot />
    </table>
  </div>
</template>
