import type { PaginatedResponse } from '@/common/types/api'
import type { IContact } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export type ContactSearchParams = {
  keyword?: string
  status?: string
  room_id?: number | ''
  page?: number
  per_page?: number
}

export class ContactService {
  static async getAdminContacts(
    params?: ContactSearchParams,
  ): Promise<PaginatedResponse<IContact>> {
    return await axiosInstance.get('/organizations/contacts', { params })
  }

  static async getAdminContactDetail(id: number): Promise<IContact> {
    const response: any = await axiosInstance.get(
      `/organizations/contacts/${id}`,
    )
    return response?.data ?? response
  }

  static async updateAdminContactStatus(
    id: number,
    payload: {
      status: 'new' | 'contacted' | 'successful' | 'unsuccessful'
      status_note?: string | null
    },
  ): Promise<IContact> {
    const response: any = await axiosInstance.patch(
      `/organizations/contacts/update-status/${id}`,
      payload,
    )
    return response?.data ?? response
  }

  static async getLandlordContacts(
    params?: ContactSearchParams,
  ): Promise<PaginatedResponse<IContact>> {
    return await axiosInstance.get('/organizations/landlord/contacts', {
      params,
    })
  }

  static async getLandlordContactDetail(id: number): Promise<IContact> {
    const response: any = await axiosInstance.get(
      `/organizations/landlord/contacts/${id}`,
    )
    return response?.data ?? response
  }

  static async updateLandlordContactStatus(
    id: number,
    payload: {
      status: 'new' | 'contacted' | 'successful' | 'unsuccessful'
      status_note?: string | null
    },
  ): Promise<IContact> {
    const response: any = await axiosInstance.patch(
      `/organizations/landlord/contacts/update-status/${id}`,
      payload,
    )
    return response?.data ?? response
  }
}
