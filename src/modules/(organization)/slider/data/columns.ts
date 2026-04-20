import { RecordStatus } from '@/common/constants/enums'
import type { ISlider } from '@/common/types/entities'
import i18n from '@/configs/i18n.config'
import DataTableRowActions from '@/components/ui/table/DataTableRowActions.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'

const t = (key: string) => (i18n.global as any).t(key) as string

export const getColumns = (): ColumnDef<ISlider>[] => [
  {
    id: 'no',
    accessorKey: 'no',
    header: t('pages.organizationSliders.columns.no'),
    meta: { sticky: 'left' },
    enableSorting: false,
    enableColumnFilter: false,
    size: 60,
    cell: (info) => info.row.index + 1,
  },
  {
    id: 'image_url',
    accessorKey: 'image_url',
    header: t('pages.organizationSliders.columns.image'),
    size: 140,
    cell: ({ row }) =>
      h('img', {
        src:
          row.original.image_url ||
          `https://placehold.co/120x70?text=${t('pages.organizationSliders.noImagePlaceholder')}`,
        class: 'h-14 w-24 rounded border object-cover',
      }),
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: t('pages.organizationSliders.columns.title'),
    size: 240,
    filterFn: 'includesString',
    cell: (info) => info.getValue() || t('common.notAvailable'),
  },
  {
    id: 'link_url',
    accessorKey: 'link_url',
    header: t('pages.organizationSliders.columns.linkUrl'),
    size: 260,
    filterFn: 'includesString',
    cell: (info) => info.getValue() || t('common.notAvailable'),
  },
  {
    id: 'sort_order',
    accessorKey: 'sort_order',
    header: t('pages.organizationSliders.columns.sortOrder'),
    size: 120,
    cell: (info) => info.getValue(),
  },
  {
    id: 'isactive',
    accessorKey: 'isactive',
    header: t('pages.organizationSliders.columns.status'),
    size: 120,
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
    id: 'remark',
    accessorKey: 'remark',
    header: t('pages.organizationSliders.columns.remark'),
    size: 220,
    cell: (info) => info.getValue() || t('common.notAvailable'),
  },
  {
    id: 'action',
    accessorKey: 'action',
    header: t('pages.organizationSliders.columns.actions'),
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
