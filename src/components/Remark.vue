<script setup lang="ts">
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const props = defineProps<{
  remark: string
}>()
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <div class="truncate max-w-50 cursor-pointer">{{ remark }}</div>
      </TooltipTrigger>
      <TooltipContent
        class="max-w-xs wrap-break-word px-3 py-1.5 border shadow-md bg-white text-slate-950 text-sm dark:bg-slate-950 dark:text-slate-50 dark:border-slate-800"
      >
        <p>
          {{ remark }}
        </p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
