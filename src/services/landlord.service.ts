import type { PaginatedResponse } from '@/common/types/api'
import type {
  ICategory,
  ICity,
  IDistrict,
  IPostType,
  IRoom,
  IRoomPhoto,
  IWard,
} from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export type LandlordRoomPayload = {
  isactive?: 'Y' | 'N'
  category_id?: number | null
  post_type_id?: number | null
  city_id?: number | null
  district_id?: number | null
  ward_id?: number | null
  title: string
  slug?: string
  address?: string | null
  price: number
  area?: number | null
  description?: string | null
  booking_status?: 'pending' | 'confirmed' | 'available' | 'occupied'
}

export type LandlordRoomSearchParams = {
  keyword?: string
  category_id?: number | ''
  post_type_id?: number | ''
  city_id?: number | ''
  district_id?: number | ''
  ward_id?: number | ''
  booking_status?: string
  isactive?: string
  sort?: string
  page?: number
  per_page?: number
}

export type LandlordDashboardResponse = {
  summary: {
    total_rooms: number
    active_rooms: number
    inactive_rooms: number
    available_rooms: number
    occupied_rooms: number
    pending_rooms: number
    total_value: number
  }
  rooms_by_status: Array<{
    status: string
    total: number
  }>
  latest_rooms: IRoom[]
}

export class LandlordService {
  static async dashboard(): Promise<LandlordDashboardResponse> {
    const response: any = await axiosInstance.get(
      '/organizations/landlord/dashboard',
    )
    return response?.data ?? response
  }

  static async getMyRooms(
    params: LandlordRoomSearchParams,
  ): Promise<PaginatedResponse<IRoom>> {
    return await axiosInstance.get('/organizations/landlord/rooms', { params })
  }

  static async getMyRoomDetail(id: number): Promise<IRoom> {
    const response: any = await axiosInstance.get(
      `/organizations/landlord/rooms/${id}`,
    )
    return response?.data ?? response
  }

  static async createMyRoom(payload: LandlordRoomPayload): Promise<IRoom> {
    const response: any = await axiosInstance.post(
      '/organizations/landlord/rooms/create',
      payload,
    )
    return response?.data ?? response
  }

  static async updateMyRoom(
    id: number,
    payload: LandlordRoomPayload,
  ): Promise<IRoom> {
    const response: any = await axiosInstance.patch(
      `/organizations/landlord/rooms/update/${id}`,
      payload,
    )
    return response?.data ?? response
  }

  static async deleteMyRoom(id: number): Promise<void> {
    await axiosInstance.delete(`/organizations/landlord/rooms/delete/${id}`)
  }

  static async getCategories(): Promise<ICategory[]> {
    const response: any = await axiosInstance.get('/categories/options')
    return response?.data ?? response ?? []
  }

  static async getPostTypes(): Promise<IPostType[]> {
    const response: any = await axiosInstance.get('/post-types/options')
    return response?.data ?? response ?? []
  }

  static async getCities(): Promise<ICity[]> {
    const response: any = await axiosInstance.get('/locations/cities')
    return response?.data ?? response ?? []
  }

  static async getDistricts(city_id?: number | ''): Promise<IDistrict[]> {
    const response: any = await axiosInstance.get('/locations/districts', {
      params: {
        ...(city_id ? { city_id } : {}),
      },
    })
    return response?.data ?? response ?? []
  }

  static async getWards(params?: {
    city_id?: number | ''
    district_id?: number | ''
  }): Promise<IWard[]> {
    const response: any = await axiosInstance.get('/locations/wards', {
      params: {
        ...(params?.city_id ? { city_id: params.city_id } : {}),
        ...(params?.district_id ? { district_id: params.district_id } : {}),
      },
    })
    return response?.data ?? response ?? []
  }

  static async getRoomPhotos(roomId: number): Promise<IRoomPhoto[]> {
    const response: any = await axiosInstance.get(
      `/organizations/landlord/rooms/${roomId}/photos`,
    )
    return response?.data ?? response ?? []
  }

  static async uploadRoomPhoto(
    roomId: number,
    file: File,
    payload?: { is_cover?: boolean; sort_order?: number },
  ): Promise<IRoomPhoto> {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('is_cover', String(payload?.is_cover ? 1 : 0))
    formData.append('sort_order', String(payload?.sort_order ?? 0))

    const response: any = await axiosInstance.post(
      `/organizations/landlord/rooms/${roomId}/photos/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    )

    return response?.data ?? response
  }

  static async updateRoomPhoto(
    roomId: number,
    photoId: number,
    payload: { is_cover?: boolean; sort_order?: number },
  ): Promise<IRoomPhoto> {
    const response: any = await axiosInstance.patch(
      `/organizations/landlord/rooms/${roomId}/photos/update/${photoId}`,
      payload,
    )
    return response?.data ?? response
  }

  static async sortRoomPhotos(
    roomId: number,
    items: Array<{ id: number; sort_order: number }>,
  ): Promise<IRoomPhoto[]> {
    const response: any = await axiosInstance.patch(
      `/organizations/landlord/rooms/${roomId}/photos/sort`,
      { items },
    )
    return response?.data ?? response ?? []
  }

  static async deleteRoomPhoto(roomId: number, photoId: number): Promise<void> {
    await axiosInstance.delete(
      `/organizations/landlord/rooms/${roomId}/photos/delete/${photoId}`,
    )
  }
}
