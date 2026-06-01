import axiosInstance from '@/configs/axios.config'

export class ProfileService {
  static async getMyProfile() {
    const res: any = await axiosInstance.get(
      '/organizations/settings/profile/me',
    )
    return res?.data ?? res
  }

  static async updateMyProfile(payload: Record<string, any>) {
    const res: any = await axiosInstance.patch(
      '/organizations/settings/profile/me',
      payload,
    )
    return res?.data ?? res
  }

  static async changeMyPassword(payload: {
    current_password: string
    password: string
    password_confirmation: string
  }) {
    const res: any = await axiosInstance.post(
      '/organizations/settings/profile/change-password',
      payload,
    )
    return res?.data ?? res
  }
}
