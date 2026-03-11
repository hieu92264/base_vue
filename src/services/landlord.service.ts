import type { PaginatedResponse } from '@/common/types/api'
import type { ICategory, IPostType, IRoom } from '@/common/types/entities'
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
  photos?: Array<{
    id?: number
    photo_url: string
    is_cover?: boolean
    sort_order?: number
  }>
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
    const response: any = await axiosInstance.get('/organizations/categories')
    return Object.values(response?.data ?? response ?? {}) as ICategory[]
  }

  static async getPostTypes(): Promise<IPostType[]> {
    const response: any = await axiosInstance.get('/post-types/options')
    return response?.data ?? response ?? []
  }
}
