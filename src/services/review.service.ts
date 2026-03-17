import type { PaginatedResponse } from '@/common/types/api'
import type { IComment, ICommentReply } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

export class ReviewService {
  static async getRoomReviews(
    roomId: number,
    params?: { page?: number; per_page?: number },
  ): Promise<PaginatedResponse<IComment> & { summary?: any }> {
    return await axiosInstance.get(`/rooms/${roomId}/reviews`, { params })
  }

  static async createReview(
    roomId: number,
    payload: { content: string; rating?: number | null },
  ): Promise<IComment> {
    const response: any = await axiosInstance.post(
      `/rooms/${roomId}/reviews/create`,
      payload,
    )
    return response?.data ?? response
  }

  static async replyReview(
    commentId: number,
    payload: { content: string },
  ): Promise<ICommentReply> {
    const response: any = await axiosInstance.post(
      `/reviews/${commentId}/reply`,
      payload,
    )
    return response?.data ?? response
  }

  static async getModerationReviews(params?: {
    keyword?: string
    status?: string
    room_id?: number | ''
    page?: number
    per_page?: number
  }): Promise<PaginatedResponse<IComment>> {
    return await axiosInstance.get('/organizations/reviews', { params })
  }

  static async updateModerationStatus(
    id: number,
    payload: { status: 'pending' | 'visible' | 'hidden' },
  ): Promise<IComment> {
    const response: any = await axiosInstance.patch(
      `/organizations/reviews/${id}/status`,
      payload,
    )
    return response?.data ?? response
  }
}
