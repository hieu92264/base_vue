<script lang="ts" setup generic="TData = unknown, TValue = unknown">
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import TablePagination from '@/components/ui/table/TablePagination.vue'
import ColumnToggle from '@/components/ui/table/toolbars/ColumnToggle.vue'
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnPinningState,
  type ColumnSizingState,
  type SortingState,
} from '@tanstack/vue-table'
import {
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  RefreshCcw,
} from 'lucide-vue-next'
import { ref } from 'vue'

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  showToolbar?: boolean
  refetchData?: () => void
  isFetching?: boolean
  updateRow?: (row: TData) => void
  deleteRow?: (row: TData) => void
}>()

const sorting = ref<SortingState>([])

const columnFilters = ref<ColumnFiltersState>([])

const columnSizing = ref<ColumnSizingState>({})

const columnVisibility = ref({})

const columnPinning = ref<ColumnPinningState>({
  left:
    props.columns
      .filter((col: any) => col.meta?.sticky === 'left')
      .map((col: any) => col.id || col.accessorKey) || [],
  right:
    props.columns
      .filter((col: any) => col.meta?.sticky === 'right')
      .map((col: any) => col.id || col.accessorKey) || [],
})

const table = useVueTable({
  meta: {
    updateRow: props.updateRow || undefined,
    deleteRow: props.deleteRow || undefined,
  },

  columnResizeMode: 'onChange',

  autoResetPageIndex: false,

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

    get columnSizing() {
      return columnSizing.value
    },

    get columnVisibility() {
      return columnVisibility.value
    },

    get columnPinning() {
      return columnPinning.value
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

  onColumnSizingChange: (updaterOrValue) => {
    columnSizing.value =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(columnSizing.value)
        : updaterOrValue
  },

  onColumnVisibilityChange: (updaterOrValue) => {
    const nextState =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(columnVisibility.value)
        : updaterOrValue
    columnVisibility.value = nextState
  },

  onColumnPinningChange: (updaterOrValue) => {
    columnPinning.value =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(columnPinning.value)
        : updaterOrValue
  },

  getCoreRowModel: getCoreRowModel(),

  getPaginationRowModel: getPaginationRowModel(),

  getSortedRowModel: getSortedRowModel(),

  getFilteredRowModel: getFilteredRowModel(),
})

const getStickyClass = (column: any) => {
  const isPinned = column.getIsPinned()
  if (!isPinned) return ''

  const baseClass = 'sticky z-20 transition-colors bg-background'

  if (isPinned === 'left') {
    const isLastPinned = column.getIsLastColumn('left')
    return `${baseClass} ${isLastPinned ? 'sticky-last-left' : ''}`
  }

  if (isPinned === 'right') {
    const isFirstPinned = column.getIsFirstColumn('right')
    return `${baseClass} ${isFirstPinned ? 'sticky-first-right' : ''}`
  }
  return ''
}
</script>

<template>
  <div
    class="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden"
  >
    <div
      v-if="props.showToolbar"
      class="p-3 border-b flex items-center justify-between gap-2 bg-background/50"
    >
      <!-- <slot
        name="toolbar"
        :table="table"
      >
      </slot> -->
      <div class="flex items-center justify-between w-full gap-4">
        <div class="relative w-full">
          <!-- left -->
          <slot
            name="toolbar_left"
            :table="table"
          >
          </slot>
        </div>

        <div class="flex items-center gap-2">
          <!-- right -->
          <ColumnToggle :table="table" />

          <Button
            variant="outline"
            size="icon"
            class="w-9 h-9"
            title="Refresh Data"
            :class="{ hidden: !props.refetchData }"
            @click="props.refetchData ? props.refetchData() : null"
          >
            <RefreshCcw
              class="w-4 h-4"
              :class="{ 'animate-spin': isFetching }"
            />
          </Button>

          <!-- <Button
            variant="outline"
            size="icon"
            class="w-9 h-9"
            title="Export Data"
            :disabled="isFetching || employeeData.length === 0"
          >
            <Download class="w-4 h-4" />
          </Button> -->

          <div class="w-px h-6 bg-border mx-1"></div>

          <slot
            name="toolbar_right"
            :table="table"
          >
          </slot>
        </div>
      </div>
    </div>

    <Table
      container-class="h-[75vh] overflow-auto border-separate border-spacing-0"
    >
      <TableHeader
        class="sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-[0_1px_0_0_rgba(0,0,0,0.1)] dark:shadow-border"
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
              left:
                header.column.getIsPinned() === 'left'
                  ? `${header.column.getStart('left')}px`
                  : undefined,
              right:
                header.column.getIsPinned() === 'right'
                  ? `${header.column.getAfter('right')}px`
                  : undefined,
            }"
            class="h-10 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap border-r last:border-r-0 cursor-pointer select-none relative"
            :class="[
              getStickyClass(header.column),
              'h-12 px-4 text-left align-middle font-semibold border-b border-r last:border-r-0',
            ]"
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
                class="shrink-0"
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

            <div
              v-if="header.column.getCanResize()"
              :class="[
                'absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none hover:bg-primary/50 transition-colors',
                header.column.getIsResizing()
                  ? 'bg-primary w-0.5'
                  : 'bg-transparent',
              ]"
              @mousedown.stop="header.getResizeHandler()($event)"
              @touchstart.stop="header.getResizeHandler()($event)"
            ></div>
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
              left:
                header.column.getIsPinned() === 'left'
                  ? `${header.column.getStart('left')}px`
                  : undefined,
              right:
                header.column.getIsPinned() === 'right'
                  ? `${header.column.getAfter('right')}px`
                  : undefined,
            }"
            :class="[
              getStickyClass(header.column),
              'h-12 px-4 text-left align-middle font-semibold border-b border-r last:border-r-0',
            ]"
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
        <template v-if="props.loading">
          <TableRow
            v-for="i in 10"
            :key="'skeleton-row-' + i"
            class="border-b last:border-b-0"
          >
            <TableCell
              v-for="header in table.getFlatHeaders()"
              :key="'skeleton-cell-' + header.id"
              class="p-4 align-middle border-r last:border-r-0"
              :style="{
                width: `${header.getSize()}px`,
                minWidth: `${header.getSize()}px`,
              }"
            >
              <Skeleton class="h-5 w-full bg-muted-foreground/10" />
            </TableCell>
          </TableRow>
        </template>

        <template v-else-if="table.getRowModel().rows?.length">
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
                left:
                  cell.column.columnDef.meta?.sticky === 'left'
                    ? `${cell.column.getStart('left')}px`
                    : undefined,
                right:
                  cell.column.columnDef.meta?.sticky === 'right'
                    ? `${cell.column.getAfter('right')}px`
                    : undefined,
              }"
              :class="[
                getStickyClass(cell.column),
                'p-4 border-b border-r last:border-r-0 whitespace-nowrap',
              ]"
            >
              <div>
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

<style scoped>
:deep(.sticky) {
  box-shadow: inset -1px 0 0 0 hsl(var(--border));
  background-clip: padding-box;
}

:deep(.sticky-last-left) {
  box-shadow:
    inset -1px 0 0 0 hsl(var(--border)),
    4px 0 8px -4px rgba(0, 0, 0, 0.5) !important;
}

:deep(.group:hover td.sticky) {
  background-color: hsl(var(--muted) / 0.5) !important;
}

:deep(thead th.sticky) {
  z-index: 40;
}
</style>
