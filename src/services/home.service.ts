import type {
  ICity,
  IDistrict,
  IRoom,
  ISlider,
  IWard,
} from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'

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
}
