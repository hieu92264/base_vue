import axios, { HttpStatusCode, type AxiosInstance } from "axios";

type PromiseExecutor<T = unknown> = {
  resolve: (value: T) => void,
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
    HttpStatusCode.TooManyRequests
  ]

  constructor(baseUrl: string, version: string = '1.0') {
    this.instance = axios.create({
      baseURL: baseUrl,
      timeout
    })
  }
}
