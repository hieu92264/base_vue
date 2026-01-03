
/**
 * noi dinh nghia cac interface hoac cac type o cap global
 * de co the goi y khi su dung
 */
export declare global {

  // cac bien env
  interface InternalImportMetaEnv {
    readonly VITE_API_BASE_URL: string
    readonly VITE_API_TIMEOUT: number
    readonly VITE_APP_NAME: string
  }

  type ResponseStatus = 'success' | 'error'

  interface PaginationMeta {
    current_page: number
    per_page: number
    total: number
    next_page_url: string | null
    prev_page_url: string | null
  }

  interface ApiResponse<T = unknown> {
    status: ResponseStatus
    message: string
    data?: T
    errors?: Record<string, unknown>
    meta?: PaginationMeta
  }

  interface PaginatedResponse<T> extends ApiResponse<T[]> {
    data: T[]
    meta: PaginationMeta
  }
}
