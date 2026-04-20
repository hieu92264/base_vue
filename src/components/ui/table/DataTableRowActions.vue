<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, SquarePen, Trash2, Eye } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

defineProps<{
  row: any
  onUpdate?: (data: any) => void
  onDelete?: (data: any) => void
  onView?: (data: any) => void
}>()

const { t } = useI18n()
</script>

<template>
  <DropdownMenu v-if="onUpdate || onDelete || onView">
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="flex h-8 w-8 p-0 mx-auto"
      >
        <MoreHorizontal class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="end"
      class="w-40"
    >
      <DropdownMenuLabel
        class="text-xs font-normal text-muted-foreground text-center"
      >
        {{ t('table.rowActions') }}
      </DropdownMenuLabel>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        v-if="onView"
        @select="onView(row)"
      >
        <Eye class="mr-2 h-4 w-4" /> {{ t('table.viewDetails') }}
      </DropdownMenuItem>

      <DropdownMenuItem
        v-if="onUpdate"
        @select="onUpdate(row)"
      >
        <SquarePen class="mr-2 h-4 w-4" /> {{ t('table.update') }}
      </DropdownMenuItem>

      <template v-if="onDelete">
        <DropdownMenuSeparator v-if="onUpdate || onView" />
        <DropdownMenuItem
          @select="onDelete(row)"
          class="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
        >
          <Trash2 class="mr-2 h-4 w-4" /> {{ t('table.delete') }}
        </DropdownMenuItem>
      </template>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
