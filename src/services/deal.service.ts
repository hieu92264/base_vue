import type { PaginatedResponse } from '@/common/types/api'
import type { IDeal } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export type DealStatus =
  | 'draft'
  | 'reserved'
  | 'confirmed'
  | 'cancelled'
  | 'completed'

export class DealService {
  static async getAdminDeals(params?: any): Promise<PaginatedResponse<IDeal>> {
    return await axiosInstance.get('/organizations/bookings', { params })
  }

  static async createAdminDeal(payload: any): Promise<IDeal> {
    const response: any = await axiosInstance.post(
      '/organizations/bookings',
      payload,
    )
    return response?.data ?? response
  }

  static async updateAdminDeal(id: number, payload: any): Promise<IDeal> {
    const response: any = await axiosInstance.patch(
      `/organizations/bookings/${id}`,
      payload,
    )
    return response?.data ?? response
  }

  static async getLandlordDeals(
    params?: any,
  ): Promise<PaginatedResponse<IDeal>> {
    return await axiosInstance.get('/organizations/landlord/bookings', {
      params,
    })
  }

  static async getTenantDeals(params?: any): Promise<PaginatedResponse<IDeal>> {
    return await axiosInstance.get('/organizations/tenant/bookings', {
      params,
    })
  }

  static async createLandlordDeal(payload: any): Promise<IDeal> {
    const response: any = await axiosInstance.post(
      '/organizations/landlord/bookings',
      payload,
    )
    return response?.data ?? response
  }

  static async updateLandlordDeal(id: number, payload: any): Promise<IDeal> {
    const response: any = await axiosInstance.patch(
      `/organizations/landlord/bookings/${id}`,
      payload,
    )
    return response?.data ?? response
  }
}
