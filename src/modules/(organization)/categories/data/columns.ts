import { RecordStatus } from '@/common/constants/enums'
import type { ICategory } from '@/common/types/entities'
import i18n from '@/configs/i18n.config'
import Remark from '@/components/Remark.vue'
import DataTableRowActions from '@/components/ui/table/DataTableRowActions.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'

const t = (key: string) => (i18n.global as any).t(key) as string

export const getColumns = (): ColumnDef<ICategory>[] => [
  {
    id: 'no',
    accessorKey: 'no',
    header: t('pages.organizationCategories.columns.no'),
    meta: { sticky: 'left' },
    enableSorting: false,
    enableColumnFilter: false,
    size: 60,
    cell: (info) => info.row.index + 1,
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: t('pages.organizationCategories.columns.code'),
    meta: { sticky: 'left' },
    size: 140,
    filterFn: 'includesString',
    cell: (info) => info.getValue(),
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: t('pages.organizationCategories.columns.name'),
    size: 220,
    filterFn: 'includesString',
    cell: (info) => info.getValue(),
  },
  {
    id: 'slug',
    accessorKey: 'slug',
    header: t('pages.organizationCategories.columns.slug'),
    size: 220,
    filterFn: 'includesString',
    cell: (info) => info.getValue(),
  },
  {
    id: 'sort_order',
    accessorKey: 'sort_order',
    header: t('pages.organizationCategories.columns.sortOrder'),
    size: 120,
    cell: (info) => info.getValue() ?? 0,
  },
  {
    id: 'remark',
    accessorKey: 'remark',
    header: t('pages.organizationCategories.columns.remark'),
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
    header: t('pages.organizationCategories.columns.status'),
    size: 140,
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      const statusText = value === RecordStatus.ACTIVE ? 'active' : 'inactive'
      return statusText.includes(String(filterValue).toLowerCase())
    },
    cell: (info) =>
      info.getValue() === RecordStatus.ACTIVE
        ? t('pages.organizationCategories.active')
        : t('pages.organizationCategories.inactive'),
  },
  {
    id: 'action',
    accessorKey: 'action',
    header: t('pages.organizationCategories.columns.actions'),
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
