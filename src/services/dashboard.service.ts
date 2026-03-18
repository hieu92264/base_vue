import axiosInstance from '@/configs/axios.config'

export type AdminDashboardResponse = {
  summary: {
    total_users: number
    total_rooms: number
    published_rooms: number
    pending_rooms: number
    total_contacts: number
    new_contacts: number
    total_bookings: number
    won_bookings: number
    total_reviews: number
    pending_reviews: number
  }
  room_status_stats: Array<{ status: string; total: number }>
  contact_status_stats: Array<{ status: string; total: number }>
  booking_status_stats: Array<{ status: string; total: number }>
  latest_contacts: any[]
  latest_rooms: any[]
}

export class DashboardService {
  static async getAdminDashboard(): Promise<AdminDashboardResponse> {
    const response: any = await axiosInstance.get('/organizations/dashboard')
    return response?.data ?? response
  }
}
