import { RecordStatus } from '@/common/constants/enums'
import type { IUser } from '@/common/types/entities'
import i18n from '@/configs/i18n.config'
import DataTableRowActions from '@/components/ui/table/DataTableRowActions.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'

const t = (key: string) => (i18n.global as any).t(key) as string

const statusLabel = (value: unknown) => {
  return value === RecordStatus.ACTIVE ? t('common.active') : t('common.inactive')
}

const userTypeLabel = (value: unknown) => {
  switch (String(value ?? '')) {
    case 'admin':
      return t('status.userType.admin')
    case 'landlord':
      return t('status.userType.landlord')
    case 'tenant':
      return t('status.userType.tenant')
    default:
      return String(value ?? '')
  }
}

const localeLabel = (value: unknown) => {
  switch (String(value ?? '').toLowerCase()) {
    case 'vi':
      return t('locales.vi')
    case 'en':
      return t('locales.en')
    default:
      return String(value ?? '')
  }
}

export const getColumns = (): ColumnDef<IUser>[] => [
  {
    id: 'no',
    header: t('pages.organizationUsers.columns.no'),
    enableSorting: false,
    enableColumnFilter: false,
    size: 60,
    meta: { sticky: 'left', maxWidth: '60px' },
    cell: (info) => info.row.index + 1,
  },
  {
    id: 'username',
    accessorKey: 'username',
    header: t('pages.organizationUsers.columns.username'),
    size: 160,
    filterFn: 'includesString',
    meta: { sticky: 'left', maxWidth: '160px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: t('pages.organizationUsers.columns.email'),
    size: 220,
    filterFn: 'includesString',
    meta: { maxWidth: '220px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'locale',
    accessorKey: 'locale',
    header: t('pages.organizationUsers.columns.locale'),
    size: 120,
    meta: { maxWidth: '120px' },
    cell: (info) => localeLabel(info.getValue()),
  },
  {
    id: 'last_login_at',
    accessorKey: 'last_login_at',
    header: t('pages.organizationUsers.columns.lastLoginAt'),
    size: 170,
    meta: { maxWidth: '170px' },
    cell: (info) => String(info.getValue() ?? t('common.notAvailable')),
  },
  {
    id: 'last_login_ip',
    accessorKey: 'last_login_ip',
    header: t('pages.organizationUsers.columns.lastLoginIp'),
    size: 140,
    meta: { maxWidth: '140px' },
    cell: (info) => String(info.getValue() ?? t('common.notAvailable')),
  },
  {
    id: 'user_remark',
    accessorKey: 'remark',
    header: t('pages.organizationUsers.columns.userRemark'),
    size: 240,
    filterFn: 'includesString',
    meta: { wrap: true, maxWidth: '240px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'isactive',
    accessorKey: 'isactive',
    header: t('pages.organizationUsers.columns.status'),
    size: 120,
    meta: { maxWidth: '120px' },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      const normalized = value === RecordStatus.ACTIVE ? 'active' : 'inactive'
      return normalized.includes(String(filterValue).toLowerCase())
    },
    cell: (info) => statusLabel(info.getValue()),
  },
  {
    id: 'full_name',
    header: t('pages.organizationUsers.columns.fullName'),
    accessorFn: (row) => row.profile?.full_name ?? '',
    size: 200,
    filterFn: 'includesString',
    meta: { maxWidth: '200px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'phone_number',
    header: t('pages.organizationUsers.columns.phoneNumber'),
    accessorFn: (row) => row.profile?.phone_number ?? '',
    size: 140,
    filterFn: 'includesString',
    meta: { maxWidth: '140px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'address',
    header: t('pages.organizationUsers.columns.address'),
    accessorFn: (row) => row.profile?.address ?? '',
    size: 280,
    filterFn: 'includesString',
    meta: { wrap: true, maxWidth: '280px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'zalo',
    header: t('pages.organizationUsers.columns.zalo'),
    accessorFn: (row) => row.profile?.zalo ?? '',
    size: 160,
    filterFn: 'includesString',
    meta: { maxWidth: '160px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'facebook',
    header: t('pages.organizationUsers.columns.facebook'),
    accessorFn: (row) => row.profile?.facebook ?? '',
    size: 220,
    filterFn: 'includesString',
    meta: { maxWidth: '220px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'avatar_url',
    header: t('pages.organizationUsers.columns.avatarUrl'),
    accessorFn: (row) => row.profile?.avatar_url ?? '',
    size: 240,
    filterFn: 'includesString',
    meta: { maxWidth: '240px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'user_type',
    header: t('pages.organizationUsers.columns.userType'),
    accessorFn: (row) => row.profile?.user_type ?? '',
    size: 140,
    filterFn: 'includesString',
    meta: { maxWidth: '140px' },
    cell: (info) => userTypeLabel(info.getValue()),
  },
  {
    id: 'profile_remark',
    header: t('pages.organizationUsers.columns.profileRemark'),
    accessorFn: (row) => row.profile?.remark ?? '',
    size: 240,
    filterFn: 'includesString',
    meta: { wrap: true, maxWidth: '240px' },
    cell: (info) => String(info.getValue() ?? ''),
  },
  {
    id: 'action',
    header: t('pages.organizationUsers.columns.actions'),
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
