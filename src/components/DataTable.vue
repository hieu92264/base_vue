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
  type ColumnSizingState,
  type SortingState,
} from '@tanstack/vue-table'
import {
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Plus,
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
}>()

const sorting = ref<SortingState>([])

const columnFilters = ref<ColumnFiltersState>([])

const columnSizing = ref<ColumnSizingState>({})

const columnVisibility = ref({})

const table = useVueTable({
  columnResizeMode: 'onChange',

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

          <Button
            size="sm"
            class="h-9 gap-1 px-3"
            :disabled="isFetching"
          >
            <Plus class="w-4 h-4" />
            Add Employee
          </Button>

          <slot
            name="toolbar_right"
            :table="table"
          >
          </slot>
        </div>
      </div>
    </div>

    <Table
      container-class="h-[75vh] overflow-x-auto overflow-y-auto border-collapse"
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
            class="h-10 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap border-r last:border-r-0 cursor-pointer select-none relative"
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
              position: 'relative',
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
              }"
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
