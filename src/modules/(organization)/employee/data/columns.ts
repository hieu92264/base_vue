import {
  DateFormatterLocale,
  Language,
  RecordStatus,
} from '@/common/constants/enums'
import type { IEmployee } from '@/common/types/entities'
import i18n from '@/configs/i18n.config'
import Remark from '@/components/Remark.vue'
import DataTableRowActions from '@/components/ui/table/DataTableRowActions.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'

const t = (key: string) => (i18n.global as any).t(key) as string

const formatDate = (value?: string | number | null) => {
  if (!value) return t('common.notAvailable')
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return t('common.notAvailable')
  const locale = i18n.global.locale as Language
  return new Intl.DateTimeFormat(
    DateFormatterLocale[locale] ?? DateFormatterLocale[Language.VIETNAMESE],
  ).format(date)
}

const workStatusLabel = (value: unknown) => {
  const key = String(value ?? '')
  const translated = t(`status.work.${key}`)
  return translated === `status.work.${key}` ? key : translated
}

export const getColumns = (): ColumnDef<IEmployee>[] => [
  {
    id: 'no',
    accessorKey: 'no',
    header: t('pages.organizationEmployees.columns.no'),
    meta: { sticky: 'left' },
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
    header: t('pages.organizationEmployees.columns.employeeCode'),
    meta: { sticky: 'left' },
    size: 160,
    minSize: 120,
    maxSize: 250,
    cell: (info) => info.getValue() || t('common.notAvailable'),
  },
  {
    id: 'isactive',
    accessorKey: 'isactive',
    header: t('pages.organizationEmployees.columns.status'),
    size: 140,
    minSize: 120,
    maxSize: 200,
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      const statusText = value === RecordStatus.ACTIVE ? 'active' : 'inactive'
      return statusText.includes(String(filterValue).toLowerCase())
    },
    cell: (info) =>
      info.getValue() === RecordStatus.ACTIVE
        ? t('common.active')
        : t('common.inactive'),
  },
  {
    id: 'user_id',
    accessorKey: 'user_id',
    header: t('pages.organizationEmployees.columns.userId'),
    size: 120,
    minSize: 80,
    maxSize: 150,
    filterFn: 'includesString',
    cell: (info) => info.getValue() ?? t('common.notAvailable'),
  },
  {
    id: 'full_name',
    accessorKey: 'full_name',
    header: t('pages.organizationEmployees.columns.fullName'),
    size: 180,
    minSize: 150,
    maxSize: 400,
    cell: (info) => info.getValue() || t('common.notAvailable'),
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: t('pages.organizationEmployees.columns.workStatus'),
    size: 150,
    minSize: 100,
    maxSize: 200,
    cell: (info) => workStatusLabel(info.getValue()),
  },
  {
    id: 'join_date',
    accessorKey: 'join_date',
    header: t('pages.organizationEmployees.columns.joinDate'),
    size: 130,
    minSize: 110,
    maxSize: 200,
    cell: (info) => formatDate(info.getValue() as string),
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: t('pages.organizationEmployees.columns.email'),
    size: 250,
    minSize: 200,
    maxSize: 500,
    cell: (info) => info.getValue() || t('common.notAvailable'),
  },
  {
    id: 'dob',
    accessorKey: 'dob',
    header: t('pages.organizationEmployees.columns.dob'),
    size: 150,
    minSize: 110,
    maxSize: 200,
    cell: (info) => formatDate(info.getValue() as string),
  },
  {
    id: 'phone',
    accessorKey: 'phone',
    header: t('pages.organizationEmployees.columns.phone'),
    size: 160,
    minSize: 120,
    maxSize: 250,
    cell: (info) => info.getValue() || t('common.notAvailable'),
  },
  {
    id: 'terminate_date',
    accessorKey: 'terminate_date',
    header: t('pages.organizationEmployees.columns.terminateDate'),
    size: 160,
    minSize: 120,
    maxSize: 250,
    cell: (info) => formatDate(info.getValue() as string),
  },
  {
    id: 'remark',
    accessorKey: 'remark',
    header: t('pages.organizationEmployees.columns.remark'),
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
    header: t('pages.organizationEmployees.columns.actions'),
    meta: { sticky: 'right' },
    size: 80,
    minSize: 80,
    maxSize: 150,
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
