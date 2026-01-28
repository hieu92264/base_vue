import { RecordStatus } from '@/common/constants/enums'
import type { IEmployee } from '@/common/types/entities'
import type { ColumnDef } from '@tanstack/vue-table'
import { format } from 'date-fns'
import { h } from 'vue'

export const columns: ColumnDef<IEmployee>[] = [
  {
    header: 'No.',
    cell: (info) => info.row.index + 1,
  },
  {
    accessorKey: 'isactive',
    header: () => h('div', { class: 'text-right' }, 'Active Status'),
    cell: (info) =>
      info.getValue() === RecordStatus.ACTIVE ? 'Active' : 'Inactive',
  },
  {
    accessorKey: 'employee_code',
    header: 'Employee Code',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'user_id',
    header: 'User ID',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'full_name',
    header: 'Full Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'status',
    header: 'Work Status',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'join_date',
    header: 'Join Date',
    cell: (info) => format(new Date(info.getValue() as string), 'dd/MM/yyyy'),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'dob',
    header: 'Date of Birth',
    cell: (info) => format(new Date(info.getValue() as string), 'dd/MM/yyyy'),
  },
  {
    accessorKey: 'phone',
    header: 'Phone Number',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'terminate_date',
    header: 'Terminate Date',
    cell: (info) =>
      info.getValue()
        ? format(new Date(info.getValue() as string), 'dd/MM/yyyy')
        : 'N/A',
  },
  {
    accessorKey: 'remark',
    header: 'Remark',
    cell: (info) => info.getValue(),
  },
]
