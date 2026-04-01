import { RecordStatus } from '@/common/constants/enums'
import type { ICategory } from '@/common/types/entities'
import Remark from '@/components/Remark.vue'
import DataTableRowActions from '@/components/ui/table/DataTableRowActions.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'

export const columns: ColumnDef<ICategory>[] = [
  {
    id: 'no',
    accessorKey: 'no',
    header: 'STT',
    meta: { sticky: 'left' },
    enableSorting: false,
    enableColumnFilter: false,
    size: 60,
    cell: (info) => info.row.index + 1,
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: 'Mã',
    meta: { sticky: 'left' },
    size: 140,
    filterFn: 'includesString',
    cell: (info) => info.getValue(),
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Tên',
    size: 220,
    filterFn: 'includesString',
    cell: (info) => info.getValue(),
  },
  {
    id: 'slug',
    accessorKey: 'slug',
    header: 'Slug',
    size: 220,
    filterFn: 'includesString',
    cell: (info) => info.getValue(),
  },
  {
    id: 'sort_order',
    accessorKey: 'sort_order',
    header: 'Thứ tự',
    size: 120,
    cell: (info) => info.getValue() ?? 0,
  },
  {
    id: 'remark',
    accessorKey: 'remark',
    header: 'Ghi chú',
    size: 260,
    cell: ({ row }) => {
      const remark = row.getValue('remark')
      if (!remark) return ''
      return h(Remark, { remark: remark as string })
    },
  },
  {
    id: 'isactive',
    accessorKey: 'isactive',
    header: 'Trạng thái',
    size: 140,
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      const statusText = value === RecordStatus.ACTIVE ? 'active' : 'inactive'
      return statusText.includes(String(filterValue).toLowerCase())
    },
    cell: (info) =>
      info.getValue() === RecordStatus.ACTIVE ? 'Hoạt động' : 'Ngưng hoạt động',
  },
  {
    id: 'action',
    accessorKey: 'action',
    header: 'Thao tác',
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
