import { RecordStatus } from '@/common/constants/enums'
import type { IEmployee } from '@/common/types/entities'
import Remark from '@/components/Remark.vue'
import DataTableRowActions from '@/components/ui/table/DataTableRowActions.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { format } from 'date-fns'
import { h, ref } from 'vue'

export const columns: ColumnDef<IEmployee>[] = [
  {
    id: 'no',
    accessorKey: 'no',
    header: 'STT',
    meta: {
      sticky: 'left',
    },
    enableSorting: false,
    enableColumnFilter: false,
    size: 60,
    minSize: 50,
    maxSize: 100,
    cell: (info) => info.row.index + 1,
  },
  {
    id: 'employee_code',
    accessorKey: 'employee_code',
    header: 'Mã nhân viên',
    meta: {
      sticky: 'left',
    },
    size: 160,
    minSize: 120,
    maxSize: 250,
    cell: (info) => info.getValue(),
  },
  {
    id: 'isactive',
    accessorKey: 'isactive',
    header: 'Trạng thái',
    size: 140,
    minSize: 120,
    maxSize: 200,
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      const statusText = value === RecordStatus.ACTIVE ? 'active' : 'inactive'
      return statusText.includes(filterValue.toLowerCase())
    },
    cell: (info) =>
      info.getValue() === RecordStatus.ACTIVE ? 'Hoạt động' : 'Ngưng hoạt động',
  },
  {
    id: 'user_id',
    accessorKey: 'user_id',
    header: 'ID người dùng',
    size: 120,
    minSize: 80,
    maxSize: 150,
    filterFn: 'includesString',
    cell: (info) => info.getValue(),
  },
  {
    id: 'full_name',
    accessorKey: 'full_name',
    header: 'Họ và tên',
    size: 180,
    minSize: 150,
    maxSize: 400,
    cell: (info) => info.getValue(),
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Trạng thái làm việc',
    size: 150,
    minSize: 100,
    maxSize: 200,
    cell: (info) => info.getValue(),
  },
  {
    id: 'join_date',
    accessorKey: 'join_date',
    header: 'Ngày vào làm',
    size: 130,
    minSize: 110,
    maxSize: 200,
    cell: (info) => {
      const val = info.getValue()
      return val ? format(new Date(val as string), 'dd/MM/yyyy') : '-'
    },
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
    size: 250,
    minSize: 200,
    maxSize: 500,
    cell: (info) => info.getValue(),
  },
  {
    id: 'dob',
    accessorKey: 'dob',
    header: 'Ngày sinh',
    size: 150,
    minSize: 110,
    maxSize: 200,
    cell: (info) => {
      const val = info.getValue()
      return val ? format(new Date(val as string), 'dd/MM/yyyy') : '-'
    },
  },
  {
    id: 'phone',
    accessorKey: 'phone',
    header: 'Số điện thoại',
    size: 160,
    minSize: 120,
    maxSize: 250,
    cell: (info) => info.getValue(),
  },
  {
    id: 'terminate_date',
    accessorKey: 'terminate_date',
    header: 'Ngày nghỉ việc',
    size: 160,
    minSize: 120,
    maxSize: 250,
    cell: (info) => {
      const val = info.getValue()
      return val ? format(new Date(val as string), 'dd/MM/yyyy') : '-'
    },
  },
  {
    id: 'remark',
    accessorKey: 'remark',
    header: 'Ghi chú',
    size: 250,
    minSize: 150,
    maxSize: 1000,
    cell: ({ row }) => {
      const remark = row.getValue('remark')
      if (!remark) return ''
      return h(Remark, {
        remark: remark as string,
      })
    },
  },
  {
    id: 'action',
    accessorKey: 'action',
    header: 'Thao tác',
    meta: {
      sticky: 'right',
    },
    size: 80,
    minSize: 80,
    maxSize: 150,
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row, table }) => {
      return h(DataTableRowActions, {
        row: row.original,
        onUpdate: (data) => table.options.meta?.updateRow?.(data),
        onDelete: (data) => table.options.meta?.deleteRow?.(data),
      })
    },
  },
]
