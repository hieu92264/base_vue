import type { IUser } from '@/common/types/entities'
import DataTableRowActions from '@/components/ui/table/DataTableRowActions.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { RecordStatus } from '@/common/constants/enums'

export const columns: ColumnDef<IUser>[] = [
  {
    id: 'no',
    header: 'No.',
    enableSorting: false,
    enableColumnFilter: false,
    size: 60,
    meta: { sticky: 'left', maxWidth: '60px' },
    cell: (info) => info.row.index + 1,
  },

  // ===== USER =====
  {
    id: 'username',
    accessorKey: 'username',
    header: 'Username',
    size: 160,
    filterFn: 'includesString',
    meta: { sticky: 'left', maxWidth: '160px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
    size: 220,
    filterFn: 'includesString',
    meta: { maxWidth: '220px' }, // truncate
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'locale',
    accessorKey: 'locale',
    header: 'Locale',
    size: 80,
    meta: { maxWidth: '80px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'last_login_at',
    accessorKey: 'last_login_at',
    header: 'Last login',
    size: 170,
    meta: { maxWidth: '170px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'last_login_ip',
    accessorKey: 'last_login_ip',
    header: 'Last IP',
    size: 140,
    meta: { maxWidth: '140px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'user_remark',
    accessorKey: 'remark',
    header: 'User remark',
    size: 240,
    filterFn: 'includesString',
    // ✅ nội dung dài nên wrap
    meta: { wrap: true, maxWidth: '240px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'isactive',
    accessorKey: 'isactive',
    header: 'Active',
    size: 90,
    meta: { maxWidth: '90px' },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      const statusText = value === RecordStatus.ACTIVE ? 'active' : 'inactive'
      return statusText.includes(String(filterValue).toLowerCase())
    },
    cell: (info) =>
      info.getValue() === RecordStatus.ACTIVE ? 'Active' : 'Inactive',
  },

  // ===== PROFILE =====
  {
    id: 'full_name',
    header: 'Full name',
    accessorFn: (row) => row.profile?.full_name ?? '',
    size: 200,
    filterFn: 'includesString',
    meta: { maxWidth: '200px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'phone_number',
    header: 'Phone',
    accessorFn: (row) => row.profile?.phone_number ?? '',
    size: 140,
    filterFn: 'includesString',
    meta: { maxWidth: '140px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'address',
    header: 'Address',
    accessorFn: (row) => row.profile?.address ?? '',
    size: 280,
    filterFn: 'includesString',
    // ✅ address dài nên wrap
    meta: { wrap: true, maxWidth: '280px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'zalo',
    header: 'Zalo',
    accessorFn: (row) => row.profile?.zalo ?? '',
    size: 160,
    filterFn: 'includesString',
    meta: { maxWidth: '160px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'facebook',
    header: 'Facebook',
    accessorFn: (row) => row.profile?.facebook ?? '',
    size: 220,
    filterFn: 'includesString',
    meta: { maxWidth: '220px' }, // truncate
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'avatar_url',
    header: 'Avatar URL',
    accessorFn: (row) => row.profile?.avatar_url ?? '',
    size: 240,
    filterFn: 'includesString',
    meta: { maxWidth: '240px' }, // truncate
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'user_type',
    header: 'User type',
    accessorFn: (row) => row.profile?.user_type ?? '',
    size: 120,
    filterFn: 'includesString',
    meta: { maxWidth: '120px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'profile_remark',
    header: 'Profile remark',
    accessorFn: (row) => row.profile?.remark ?? '',
    size: 240,
    filterFn: 'includesString',
    meta: { wrap: true, maxWidth: '240px' },
    cell: (info) => String(info.getValue() ?? ''),
  },

  // ===== ACTIONS =====
  {
    id: 'action',
    header: 'Actions',
    size: 80,
    enableSorting: false,
    enableColumnFilter: false,
    meta: { sticky: 'right', maxWidth: '80px' },
    cell: ({ row, table }) =>
      h(DataTableRowActions, {
        row: row.original,
        onUpdate: (data) => table.options.meta?.updateRow?.(data),
        onDelete: (data) => table.options.meta?.deleteRow?.(data),
      }),
  },
]
