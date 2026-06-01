import { AppConfigs } from '@/configs/app.config'

const trimSlash = (value: string) => value.replace(/^\/+/, '')

const getApiOrigin = () => {
  try {
    const base = String(AppConfigs.BASE_API_URL || '')
    return new URL(base).origin
  } catch {
    return window.location.origin
  }
}

export const buildStorageUrl = (path?: string | null) => {
  if (!path) return ''

  if (/^https?:\/\//i.test(path)) return path

  const cleanPath = trimSlash(path)
  return `${getApiOrigin()}/storage/${cleanPath}`
}

export const withVersion = (
  url?: string | null,
  version?: string | number | null,
) => {
  if (!url) return ''
  if (!version) return url

  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}v=${encodeURIComponent(String(version))}`
}
