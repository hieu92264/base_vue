import type { PaginatedResponse } from '@/common/types/api'
import type { IContact } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'viewing_scheduled'
  | 'viewed'
  | 'negotiating'
  | 'waiting_decision'
  | 'won'
  | 'lost'
  | 'cancelled'

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
      status: LeadStatus
      status_note?: string | null
      lost_reason?: string | null
      next_follow_up_at?: string | null
      viewing_at?: string | null
    },
  ): Promise<IContact> {
    const response: any = await axiosInstance.patch(
      `/organizations/contacts/${id}/status`,
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
      status: LeadStatus
      status_note?: string | null
      lost_reason?: string | null
      next_follow_up_at?: string | null
      viewing_at?: string | null
    },
  ): Promise<IContact> {
    const response: any = await axiosInstance.patch(
      `/organizations/landlord/contacts/${id}/status`,
      payload,
    )
    return response?.data ?? response
  }
}
