import { RecordStatus } from '@/common/constants/enums'
import type { IPermission } from '@/common/types/entities'
import DataTableRowActions from '@/components/ui/table/DataTableRowActions.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'

export const columns: ColumnDef<IPermission>[] = [
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
    size: 180,
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
    id: 'url',
    accessorKey: 'url',
    header: 'Đường dẫn',
    size: 320,
    filterFn: 'includesString',
    cell: (info) => info.getValue(),
  },
  {
    id: 'parent_id',
    accessorKey: 'parent_id',
    header: 'ID cha',
    size: 120,
    cell: (info) => info.getValue() ?? '-',
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
