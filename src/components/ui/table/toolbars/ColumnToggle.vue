<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Column, Table } from '@tanstack/vue-table'
import { Funnel } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps<{
  table: Table<any>
}>()

const getLabel = (column: Column<any>) => {
  const header = column.columnDef.header
  if (typeof header === 'string') return header
  return column.id
}

const columns = computed(() => {
  return props.table.getAllLeafColumns().filter((column) => {
    return typeof column.id !== 'undefined' && column.getCanHide()
  })
})
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="outline"
        size="icon"
        class="w-9 h-9"
        title="Ẩn/Hiện cột"
      >
        <Funnel class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="end"
      class="w-56"
    >
      <DropdownMenuLabel>Hiển thị cột</DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuCheckboxItem
        v-for="column in columns"
        :key="column.id"
        class="capitalize cursor-pointer"
        :model-value="column.getIsVisible()"
        @update:model-value="
          (value: boolean) => column.toggleVisibility(!!value)
        "
      >
        {{ getLabel(column) }}
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
