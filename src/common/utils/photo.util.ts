import { AppConfigs } from '@/configs/app.config'
import type { IRoomPhoto } from '@/common/types/entities'

const trimSlash = (value: string) => value.replace(/^\/+/, '')

const getApiOrigin = () => {
  try {
    return new URL(String(AppConfigs.BASE_API_URL || '')).origin
  } catch {
    return window.location.origin
  }
}

export const resolvePhotoUrl = (input?: string | null) => {
  if (!input) return ''

  const value = String(input).trim()
  if (!value) return ''

  if (/^blob:/i.test(value)) return value
  if (/^https?:\/\//i.test(value)) return value

  const origin = getApiOrigin()

  if (value.startsWith('/storage/')) {
    return `${origin}${value}`
  }

  if (value.startsWith('storage/')) {
    return `${origin}/${value}`
  }

  return `${origin}/storage/${trimSlash(value)}`
}

export const appendVersion = (
  url?: string | null,
  version?: string | number | null,
) => {
  if (!url) return ''
  if (!version) return url

  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}v=${encodeURIComponent(String(version))}`
}

export const normalizePhoto = (photo: IRoomPhoto): IRoomPhoto => {
  const raw = photo.preview_url || photo.photo_url || photo.photo_path || ''

  return {
    ...photo,
    photo_url: appendVersion(
      resolvePhotoUrl(raw),
      photo.photo_version || photo.updated_at || Date.now(),
    ),
  }
}

export const normalizePhotos = (items: IRoomPhoto[] = []) =>
  items.map(normalizePhoto)
