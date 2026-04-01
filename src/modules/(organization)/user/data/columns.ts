import type { IUser } from '@/common/types/entities'
import DataTableRowActions from '@/components/ui/table/DataTableRowActions.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { RecordStatus } from '@/common/constants/enums'

export const columns: ColumnDef<IUser>[] = [
  {
    id: 'no',
    header: 'STT',
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
    header: 'Tên đăng nhập',
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
    header: 'Ngôn ngữ',
    size: 80,
    meta: { maxWidth: '80px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'last_login_at',
    accessorKey: 'last_login_at',
    header: 'Lần đăng nhập cuối',
    size: 170,
    meta: { maxWidth: '170px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'last_login_ip',
    accessorKey: 'last_login_ip',
    header: 'IP cuối',
    size: 140,
    meta: { maxWidth: '140px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'user_remark',
    accessorKey: 'remark',
    header: 'Ghi chú người dùng',
    size: 240,
    filterFn: 'includesString',
    // ✅ nội dung dài nên wrap
    meta: { wrap: true, maxWidth: '240px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'isactive',
    accessorKey: 'isactive',
    header: 'Trạng thái',
    size: 90,
    meta: { maxWidth: '90px' },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      const statusText = value === RecordStatus.ACTIVE ? 'active' : 'inactive'
      return statusText.includes(String(filterValue).toLowerCase())
    },
    cell: (info) =>
      info.getValue() === RecordStatus.ACTIVE ? 'Hoạt động' : 'Ngưng hoạt động',
  },

  // ===== PROFILE =====
  {
    id: 'full_name',
    header: 'Họ và tên',
    accessorFn: (row) => row.profile?.full_name ?? '',
    size: 200,
    filterFn: 'includesString',
    meta: { maxWidth: '200px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'phone_number',
    header: 'Điện thoại',
    accessorFn: (row) => row.profile?.phone_number ?? '',
    size: 140,
    filterFn: 'includesString',
    meta: { maxWidth: '140px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'address',
    header: 'Địa chỉ',
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
    header: 'Ảnh đại diện',
    accessorFn: (row) => row.profile?.avatar_url ?? '',
    size: 240,
    filterFn: 'includesString',
    meta: { maxWidth: '240px' }, // truncate
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'user_type',
    header: 'Loại người dùng',
    accessorFn: (row) => row.profile?.user_type ?? '',
    size: 120,
    filterFn: 'includesString',
    meta: { maxWidth: '120px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'profile_remark',
    header: 'Ghi chú hồ sơ',
    accessorFn: (row) => row.profile?.remark ?? '',
    size: 240,
    filterFn: 'includesString',
    meta: { wrap: true, maxWidth: '240px' },
    cell: (info) => String(info.getValue() ?? ''),
  },

  // ===== ACTIONS =====
  {
    id: 'action',
    header: 'Thao tác',
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
