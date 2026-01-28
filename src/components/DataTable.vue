<script lang="ts" setup generic="TData = unknown, TValue = unknown">
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import TablePagination from '@/components/ui/table/TablePagination.vue'
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/vue-table'
import {
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from 'lucide-vue-next'
import { ref } from 'vue'

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}>()

const sorting = ref<SortingState>([])

const columnFilters = ref<ColumnFiltersState>([])

const table = useVueTable({
  get data() {
    return props.data
  },

  get columns() {
    return props.columns
  },

  state: {
    get sorting() {
      return sorting.value
    },

    get columnFilters() {
      return columnFilters.value
    },
  },

  onSortingChange: (updaterOrValue) => {
    sorting.value =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(sorting.value)
        : updaterOrValue
  },

  onColumnFiltersChange: (updaterOrValue) => {
    columnFilters.value =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(columnFilters.value)
        : updaterOrValue
  },

  getCoreRowModel: getCoreRowModel(),

  getPaginationRowModel: getPaginationRowModel(),

  getSortedRowModel: getSortedRowModel(),

  getFilteredRowModel: getFilteredRowModel(),
})

const { rows } = table.getRowModel()
</script>

<template>
  <div
    class="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden"
  >
    <Table
      container-class="h-[80vh] overflow-x-auto overflow-y-auto border-collapse"
    >
      <TableHeader
        class="sticky top-0 z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-[0_1px_0_0_rgba(0,0,0,0.1)] dark:shadow-border"
      >
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
          class="hover:bg-transparent border-b"
        >
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            :style="{
              width: `${header.getSize()}px`,
              minWidth: `${header.getSize()}px`,
            }"
            class="h-10 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap border-r last:border-r-0 cursor-pointer select-none"
            @click="header.column.getToggleSortingHandler()?.($event)"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="truncate">
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </span>

              <span
                v-if="header.column.getCanSort()"
                class="flex-shrink-0"
              >
                <template v-if="header.column.getIsSorted() === 'asc'">
                  <ArrowUpNarrowWide class="w-4 h-4" />
                </template>
                <template v-else-if="header.column.getIsSorted() === 'desc'">
                  <ArrowDownWideNarrow class="w-4 h-4" />
                </template>
                <template v-else>
                  <ArrowDownUp class="w-4 h-4 opacity-30" />
                </template>
              </span>
            </div>
          </TableHead>
        </TableRow>

        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="'filter-' + headerGroup.id"
          class="border-b"
        >
          <TableHead
            v-for="header in headerGroup.headers"
            :key="'filter-' + header.id"
            class="p-2 border-r last:border-r-0 bg-muted/30"
            :style="{
              width: `${header.getSize()}px`,
              minWidth: `${header.getSize()}px`,
            }"
          >
            <div v-if="header.column.getCanFilter()">
              <input
                type="text"
                :value="header.column.getFilterValue() ?? ''"
                @input="
                  header.column.setFilterValue(
                    ($event.target as HTMLInputElement).value,
                  )
                "
                placeholder="Find..."
                class="w-full px-2 py-1 text-xs font-normal border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary h-8"
              />
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() && 'selected'"
            class="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-b last:border-b-0"
          >
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="p-4 align-middle border-r last:border-r-0"
              :style="{
                width: `${cell.column.getSize()}px`,
                minWidth: `${cell.column.getSize()}px`,
              }"
            >
              <div class="truncate">
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </div>
            </TableCell>
          </TableRow>
        </template>

        <template v-else>
          <TableRow>
            <TableCell
              :colspan="columns.length"
              class="h-32 text-center text-muted-foreground"
            >
              <div class="flex flex-col items-center justify-center gap-1">
                <p class="text-sm font-medium">Không tìm thấy kết quả</p>
                <p class="text-xs">
                  Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
                </p>
              </div>
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
    <TablePagination :table="table" />
  </div>
</template>
