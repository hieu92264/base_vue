import { RequestHeader } from '@/common/constants/enums'
import type { IUser } from '@/common/types/entities'
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
  private unAuthorizedRequestHandlers: Array<PromiseExecutor<string | null>> =
    []

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
      (response) => {
        console.log('Response:', response)
        return response.data
      },
      async (error: AxiosError<ResponseBody<unknown>>) => {
        const { config, response } = error
        const errorStatus = response?.status
        const originalRequest = config as any

        if (
          error.code === AxiosError.ETIMEDOUT ||
          error.code === AxiosError.ECONNABORTED
        ) {
          toast.error('Request timeout')
          return Promise.reject(error)
        }

        const isLoginPath = config?.url?.includes('/login')

        if (errorStatus && this.NOTIFIABLE_ERROR_CODES.includes(errorStatus)) {
          let message = response?.data?.message

          if (isLoginPath && errorStatus === HttpStatusCode.Unauthorized) {
            message = 'Invalid username or password'
          }

          toast.error(message || 'Đã có lỗi xảy ra', {
            id: response?.data?.path || 'global-error',
            duration: 5000,
          })
        }

        if (
          errorStatus === HttpStatusCode.Unauthorized &&
          !isLoginPath &&
          originalRequest &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true
          const abortController = new AbortController()

          if (this.isRefreshToken) {
            return new Promise((resolve, reject) => {
              this.unAuthorizedRequestHandlers.push({ resolve, reject })
            })
              .then((token) => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`
                return this.instance(originalRequest)
              })
              .catch((err) => Promise.reject(err))
          }
          this.isRefreshToken = true

          const credential = await AuthService.getCredentials()
          if (!credential.data?.id) {
            AuthService.logout()
            abortController.abort()
            toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', {
              id: 'unauthorized-error',
            })
            return Promise.reject(error)
          }

          try {
            if (!credential?.data.id) throw new Error('No credential id found')
              const 
          } catch (error) {}
        }

        console.log('Axios Error:', error)

        return Promise.reject(error)
      },
    )
  }
}

const axiosInstance = new AxiosClient(AppConfigs.BASE_API_URL, '1.0').instance

export default axiosInstance
