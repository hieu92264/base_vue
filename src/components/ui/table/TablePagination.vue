<script setup lang="ts" generic="TData = unknown">
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import SelectValue from '@/components/ui/select/SelectValue.vue'
import type { Table } from '@tanstack/vue-table'

const props = defineProps<{
  table: Table<TData>
}>()
</script>

<template>
  <div
    class="flex items-center justify-between px-2 py-4 border-t bg-background"
  >
    <div class="flex-1 text-sm text-muted-foreground">
      Total Rows:
      <span class="font-medium text-foreground">{{
        table.getFilteredRowModel().rows.length
      }}</span>
    </div>

    <div class="flex items-center space-x-6 lg:space-x-8">
      <div class="flex items-center space-x-2">
        <Select
          :model-value="table.getState().pagination.pageSize"
          @update:model-value="(val) => table.setPageSize(Number(val))"
        >
          <SelectTrigger>
            <SelectValue
              :placeholder="`${table.getState().pagination.pageSize}`"
            />
          </SelectTrigger>

          <SelectContent>
            <SelectItem
              v-for="pageSize in [15, 30, 50, 100, 150]"
              :key="pageSize"
              :value="`${pageSize}`"
            >
              {{ pageSize }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Pagination
        :total="table.getFilteredRowModel().rows.length"
        :sibling-count="1"
        :items-per-page="table.getState().pagination.pageSize"
        :default-page="1"
        @update:page="(page) => table.setPageIndex(page - 1)"
      >
        <PaginationContent v-slot="{ items }">
          <PaginationFirst
            @click="table.setPageIndex(0)"
            :disabled="!table.getCanPreviousPage()"
          />

          <PaginationPrevious
            @click="table.previousPage()"
            :disabled="!table.getCanPreviousPage()"
          />

          <template v-for="(item, index) in items">
            <PaginationItem
              v-if="item.type === 'page'"
              :key="index"
              :value="item.value"
              as-child
            >
              <Button
                class="w-9 h-9 p-0"
                :variant="
                  item.value === table.getState().pagination.pageIndex + 1
                    ? 'default'
                    : 'ghost'
                "
                @click="table.setPageIndex(item.value - 1)"
              >
                {{ item.value }}
              </Button>
            </PaginationItem>

            <PaginationEllipsis
              v-else
              :key="item.type"
              :index="index"
            />
          </template>

          <PaginationNext
            @click="table.nextPage()"
            :disabled="!table.getCanNextPage()"
          />

          <PaginationLast
            @click="table.setPageIndex(table.getPageCount() - 1)"
            :disabled="!table.getCanNextPage()"
          />
        </PaginationContent>
      </Pagination>
    </div>
  </div>
</template>
