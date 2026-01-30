import '@tanstack/vue-table'

declare module '@tanstack/vue-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    sticky?: 'left' | 'right'
  }

  interface TableMeta<TData extends RowData> {
    updateRow?: (data: TData) => void
    deleteRow?: (data: TData) => void
  }
}
