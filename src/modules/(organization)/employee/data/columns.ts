import { RecordStatus } from '@/common/constants/enums'
import type { IEmployee } from '@/common/types/entities'
import type { ColumnDef } from '@tanstack/vue-table'
import { format } from 'date-fns'
import { h, ref } from 'vue'

export const columns: ColumnDef<IEmployee>[] = [
  {
    header: 'No.',
    accessorKey: 'no',
    enableSorting: false,
    enableColumnFilter: false,
    size: 50,
    cell: (info) => info.row.index + 1,
  },
  {
    accessorKey: 'isactive',
    header: 'Active Status',
    size: 130,
    cell: (info) =>
      info.getValue() === RecordStatus.ACTIVE ? 'Active' : 'Inactive',
  },
  {
    accessorKey: 'employee_code',
    header: 'Employee Code',
    size: 150,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'user_id',
    header: 'User ID',
    size: 100,
    filterFn: 'includesString',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'full_name',
    header: 'Full Name',
    size: 150,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'status',
    header: 'Work Status',
    size: 130,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'join_date',
    header: 'Join Date',
    size: 120,
    cell: (info) => format(new Date(info.getValue() as string), 'dd/MM/yyyy'),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 240,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'dob',
    header: 'Date of Birth',
    size: 130,
    cell: (info) => format(new Date(info.getValue() as string), 'dd/MM/yyyy'),
  },
  {
    accessorKey: 'phone',
    header: 'Phone Number',
    size: 150,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'terminate_date',
    header: 'Terminate Date',
    size: 150,
    cell: (info) =>
      info.getValue()
        ? format(new Date(info.getValue() as string), 'dd/MM/yyyy')
        : 'N/A',
  },
  {
    accessorKey: 'remark',
    header: 'Remark',
    size: 300,
    cell: (info) => info.getValue(),
  },
]
