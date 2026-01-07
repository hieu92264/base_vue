import type { HttpStatusCode } from 'axios'

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

  type ResponseBody<T> = {
    message: string
    statusCode: HttpStatusCode
    data: T | null
    path: string
    stack?: string
    timestamp: Date
  }

  type Pagination<T = unknown> = {
    data: Array<T>
    hasNextPage: boolean
    hasPrevPage: boolean
    limit: number
    page: number
    totalDocs: number
    totalPage: number
    nextPage: number | null
    prevPage: number | null
  }

  type Locale = 'vi' | 'en' | 'cn'
}
