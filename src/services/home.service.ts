import type {
  ICity,
  IDistrict,
  IRoom,
  ISlider,
  IWard,
} from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import type { ContactFormValues } from '@/modules/(general)/home/-schemas/contact.schema'

export class HomeService {
  static async sliders(): Promise<ISlider[]> {
    const response = await axiosInstance.get('/sliders')
    return response.data
  }

  static async featureRooms(): Promise<IRoom[]> {
    const response = await axiosInstance.get('/rooms/featured')
    return response.data
  }

  static async cities(): Promise<ICity[]> {
    const response = await axiosInstance.get('/locations/cities')
    return response.data
  }

  static async districts(): Promise<IDistrict[]> {
    const response = await axiosInstance.get('/locations/districts')
    return response.data
  }

  static async wards(): Promise<IWard[]> {
    const response = await axiosInstance.get('/locations/wards')
    return response.data
  }

  static async roomDetails(roomId: number): Promise<any> {
    const response = await axiosInstance.get(`/rooms/detail/${roomId}`)
    console.log('Room details response:', response.data) // Debug log
    return response.data
  }

  static async contact(formData: ContactFormValues, id: string): Promise<void> {
    await axiosInstance.post(`/contact/${id}`, formData)
  }
}
