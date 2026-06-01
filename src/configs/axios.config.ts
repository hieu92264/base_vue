import { Language, RequestHeader } from '@/common/constants/enums'
import { env } from '@/common/utils/env.util'
import { AppConfigs } from '@/configs/app.config'
import i18n from '@/configs/i18n.config'
import router from '@/router'
import { AuthService } from '@/services'
import { useAuthStore } from '@/stores/auth.store'
import { useUserStore } from '@/stores/user.store'
import axios, { AxiosError, HttpStatusCode, type AxiosInstance } from 'axios'
import qs from 'qs'
import { toast } from 'vue-sonner'

type PromiseExecutor<T = unknown> = {
  resolve: (value: T) => void
  reject: (reason?: unknown) => void
}

const SUPPORTED_LANGUAGES = new Set<Language>(Object.values(Language))

const getRequestLocale = (): Language => {
  const localeSource = i18n.global.locale as unknown
  const locale =
    typeof localeSource === 'string'
      ? localeSource
      : typeof localeSource === 'object' &&
          localeSource !== null &&
          'value' in localeSource
        ? localeSource.value
        : null

  return SUPPORTED_LANGUAGES.has(locale as Language)
    ? (locale as Language)
    : Language.VIETNAMESE
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
        const authStore = useAuthStore()
        const accessToken = authStore.access_token
        const locale = getRequestLocale()
        config.headers[RequestHeader.AUTHORIZATION] =
          config.headers[RequestHeader.AUTHORIZATION] ??
          (accessToken ? `Bearer ${accessToken}` : '')
        // config.headers[RequestHeader.USER_COMPANY] = user?.company_code
        config.headers[RequestHeader.ACCEPT_LANGUAGE] =
          config.headers[RequestHeader.ACCEPT_LANGUAGE] ?? locale
        config.headers[RequestHeader.LOCALE] =
          config.headers[RequestHeader.LOCALE] ?? locale

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
          toast.error('Yêu cầu đã hết thời gian chờ')
          return Promise.reject(error)
        }

        const isLoginPath = config?.url?.includes('/login')

        if (errorStatus && this.NOTIFIABLE_ERROR_CODES.includes(errorStatus)) {
          let message = response?.data?.message

          if (isLoginPath && errorStatus === HttpStatusCode.Unauthorized) {
            message = 'Tên đăng nhập hoặc mật khẩu không đúng'
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
          originalRequest.signal = abortController.signal

          if (this.isRefreshToken) {
            return new Promise((resolve, reject) => {
              this.unAuthorizedRequestHandlers.push({ resolve, reject })
            })
              .then((token) => {
                originalRequest.headers[RequestHeader.AUTHORIZATION] =
                  `Bearer ${token}`
                return this.instance(originalRequest)
              })
              .catch((err) => {
                abortController.abort()
                Promise.reject(err)
                return Promise.reject(err)
              })
          }
          this.isRefreshToken = true

          try {
            const authStore = useAuthStore()
            const currentRefreshToken = authStore.refresh_token

            if (!currentRefreshToken) {
              throw new Error('No refresh token available')
            }

            const res = await AuthService.getToken(currentRefreshToken)
            if (res && res.data) {
              const { access_token, refresh_token } = res.data
              authStore.saveSession(access_token ?? '', refresh_token ?? '')

              const newToken = authStore.access_token

              this.unAuthorizedRequestHandlers.forEach((promise) =>
                promise.resolve(newToken),
              )
              this.unAuthorizedRequestHandlers = []

              originalRequest.headers[RequestHeader.AUTHORIZATION] =
                `Bearer ${newToken}`
              return this.instance(originalRequest)
            } else {
              throw new Error('Refresh failed')
            }
          } catch (error) {
            this.unAuthorizedRequestHandlers.forEach((promise) =>
              promise.reject(error),
            )
            this.unAuthorizedRequestHandlers = []
            abortController.abort()

            const authStore = useAuthStore()
            const userStore = useUserStore()

            authStore.clearSession()
            userStore.clearProfile()

            toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')

            router.push({ name: 'auth.login' })

            return Promise.reject(error)
          } finally {
            this.isRefreshToken = false
          }
        }

        return Promise.reject(error)
      },
    )
  }
}

const axiosInstance = new AxiosClient(AppConfigs.BASE_API_URL, '1.0').instance

export default axiosInstance
