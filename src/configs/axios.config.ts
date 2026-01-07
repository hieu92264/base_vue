import { RequestHeader } from '@/common/constants/enums'
import { env } from '@/common/utils/env'
import { AppConfigs } from '@/configs/app.config'
import { AuthService, StorageService } from '@/services'
import axios, { AxiosError, HttpStatusCode, type AxiosInstance } from 'axios'
import qs from 'qs'
import { toast } from 'vue-sonner'

type PromiseExecutor<T = unknown> = {
  resolve: (value: T) => void
  reject: (reason?: unknown) => void
}

export class AxiosClient {
  public instance: AxiosInstance
  private isRefreshToken = false
  private unAuthorizedRequestHandlers: Array<PromiseExecutor<string | null>> = []

  private readonly NOTIFIABLE_ERROR_CODES = [
    HttpStatusCode.BadRequest,
    HttpStatusCode.Forbidden,
    HttpStatusCode.NotFound,
    HttpStatusCode.PayloadTooLarge,
    HttpStatusCode.Conflict,
    HttpStatusCode.TooManyRequests,
  ]

  constructor(baseUrl: string, version: string = '1.0') {
    this.instance = axios.create({
      baseURL: baseUrl,
      timeout: env('VITE_API_TIMEOUT', 10_000),
      headers: {
        [RequestHeader.CONTENT_TYPE]: 'application/json',
        [RequestHeader.API_VERSION]: version,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, {
          skipNulls: true,
          format: 'RFC1738',
        })
      },
    })

    this.instance.interceptors.request.use(
      (config) => {
        const accessToken = AuthService.getAccessToken()
        const locale = StorageService.getLocale()
        const user = AuthService.getCredentials()
        config.headers[RequestHeader.AUTHORIZATION] =
          config.headers[RequestHeader.AUTHORIZATION] ?? (accessToken as string)
        // config.headers[RequestHeader.USER_COMPANY] = user?.company_code
        config.headers[RequestHeader.ACCEPT_LANGUAGE] = locale

        return config
      },
      (error) => Promise.reject(error),
    )

    this.instance.interceptors.response.use(
      (response) => response.data,
      async (error: AxiosError<ResponseBody<unknown>>) => {
        if (error.code === AxiosError.ETIMEDOUT || error.code === AxiosError.ECONNABORTED) {
          toast.error('Request timeout')
        }

        if (error.response?.status && this.NOTIFIABLE_ERROR_CODES.includes(error.response.status)) {
          toast.error(error.response?.data?.message, {
            id: error.response?.data?.path,
            duration: 5000,
          })
        }

        const originalRequest = error.config
        const errorStatus = error.response?.status

        if (
          originalRequest &&
          !originalRequest.retry &&
          error.status === HttpStatusCode.Unauthorized
        ) {
          const abortController = new AbortController()

          if (this.isRefreshToken) {
            return new Promise((resolve, reject) => {
              this.unAuthorizedRequestHandlers.push({ resolve, reject })
            })
              .then((token) => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`
                return this.instance(originalRequest)
              })
              .catch((err) => {
                return Promise.reject(err)
              })
          }

          this.isRefreshToken = true

          const credentials = AuthService.getCredentials()
          // if (!credentials?.id) {
          // }
        }
      },
    )
  }
}

const axiosInstance = new AxiosClient(AppConfigs.BASE_API_URL, '1.0').instance

export default axiosInstance
