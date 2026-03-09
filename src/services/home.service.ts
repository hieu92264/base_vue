import type {
  ICity,
  IDistrict,
  IRoom,
  ISlider,
  IWard,
} from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import type { ContactFormValues } from '@/modules/(general)/home/-schemas/contact.schema'
import type { PaginatedResponse } from '@/common/types/api'

export type RoomSearchParams = {
  keyword?: string
  city_id?: number | ''
  district_id?: number | ''
  ward_id?: number | ''
  min_price?: number
  max_price?: number
  min_area?: number
  max_area?: number
  sort?: string
  page?: number
  per_page?: number
}

export class HomeService {
  static async sliders(): Promise<ISlider[]> {
    const response: ResponseBody<ISlider[]> = await axiosInstance.get(
      '/organizations/sliders',
    )
    return response?.data ?? []
  }

  static async featureRooms(): Promise<IRoom[]> {
    const response: ResponseBody<IRoom[]> =
      await axiosInstance.get('/rooms/featured')
    return response?.data ?? []
  }

  static async searchRooms(
    params: RoomSearchParams,
  ): Promise<PaginatedResponse<IRoom>> {
    return await axiosInstance.get('/rooms', { params })
  }

  static async cities(): Promise<ICity[]> {
    const response: any = await axiosInstance.get('/locations/cities')
    return response?.data ?? response
  }

  static async districts(): Promise<IDistrict[]> {
    const response: any = await axiosInstance.get('/locations/districts')
    return response?.data ?? response
  }

  static async wards(): Promise<IWard[]> {
    const response: any = await axiosInstance.get('/locations/wards')
    return response?.data ?? response
  }

  static async roomDetails(slugOrId: string): Promise<any> {
    const response: any = await axiosInstance.get(`/rooms/${slugOrId}`)
    return response?.data ?? response
  }

  static async contact(formData: ContactFormValues, id: string): Promise<void> {
    await axiosInstance.post(`/contact/${id}`, formData)
  }
}
