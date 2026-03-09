import { RecordStatus } from '@/common/constants/enums'
import type { ISlider } from '@/common/types/entities'
import DataTableRowActions from '@/components/ui/table/DataTableRowActions.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'

export const columns: ColumnDef<ISlider>[] = [
  {
    id: 'no',
    accessorKey: 'no',
    header: 'No.',
    meta: { sticky: 'left' },
    enableSorting: false,
    enableColumnFilter: false,
    size: 60,
    cell: (info) => info.row.index + 1,
  },
  {
    id: 'image_url',
    accessorKey: 'image_url',
    header: 'Image',
    size: 140,
    cell: ({ row }) =>
      h('img', {
        src:
          row.original.image_url || 'https://placehold.co/120x70?text=No+Image',
        class: 'h-14 w-24 rounded object-cover border',
      }),
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: 'Title',
    size: 240,
    filterFn: 'includesString',
    cell: (info) => info.getValue() || '-',
  },
  {
    id: 'link_url',
    accessorKey: 'link_url',
    header: 'Link URL',
    size: 260,
    filterFn: 'includesString',
    cell: (info) => info.getValue() || '-',
  },
  {
    id: 'sort_order',
    accessorKey: 'sort_order',
    header: 'Sort Order',
    size: 120,
    cell: (info) => info.getValue(),
  },
  {
    id: 'isactive',
    accessorKey: 'isactive',
    header: 'Status',
    size: 120,
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      const statusText = value === RecordStatus.ACTIVE ? 'active' : 'inactive'
      return statusText.includes(String(filterValue).toLowerCase())
    },
    cell: (info) =>
      info.getValue() === RecordStatus.ACTIVE ? 'Active' : 'Inactive',
  },
  {
    id: 'remark',
    accessorKey: 'remark',
    header: 'Remark',
    size: 220,
    cell: (info) => info.getValue() || '-',
  },
  {
    id: 'action',
    accessorKey: 'action',
    header: 'Actions',
    meta: { sticky: 'right' },
    size: 80,
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row, table }) =>
      h(DataTableRowActions, {
        row: row.original,
        onUpdate: (data) => table.options.meta?.updateRow?.(data),
        onDelete: (data) => table.options.meta?.deleteRow?.(data),
      }),
  },
]
