import { RecordStatus } from '@/common/constants/enums'
import type { IPermission } from '@/common/types/entities'
import i18n from '@/configs/i18n.config'
import DataTableRowActions from '@/components/ui/table/DataTableRowActions.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'

const t = (key: string) => (i18n.global as any).t(key) as string

export const getColumns = (): ColumnDef<IPermission>[] => [
  {
    id: 'no',
    accessorKey: 'no',
    header: t('pages.organizationPermissions.columns.no'),
    meta: { sticky: 'left' },
    enableSorting: false,
    enableColumnFilter: false,
    size: 60,
    cell: (info) => info.row.index + 1,
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: t('pages.organizationPermissions.columns.code'),
    meta: { sticky: 'left' },
    size: 180,
    filterFn: 'includesString',
    cell: (info) => info.getValue(),
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: t('pages.organizationPermissions.columns.name'),
    size: 220,
    filterFn: 'includesString',
    cell: (info) => info.getValue(),
  },
  {
    id: 'url',
    accessorKey: 'url',
    header: t('pages.organizationPermissions.columns.url'),
    size: 320,
    filterFn: 'includesString',
    cell: (info) => info.getValue() || t('common.notAvailable'),
  },
  {
    id: 'parent_id',
    accessorKey: 'parent_id',
    header: t('pages.organizationPermissions.columns.parentId'),
    size: 120,
    cell: (info) => info.getValue() ?? t('common.notAvailable'),
  },
  {
    id: 'isactive',
    accessorKey: 'isactive',
    header: t('pages.organizationPermissions.columns.status'),
    size: 140,
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
    id: 'action',
    accessorKey: 'action',
    header: t('pages.organizationPermissions.columns.actions'),
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
