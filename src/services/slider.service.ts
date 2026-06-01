import type { ISlider } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import type { SliderFormValues } from '@/modules/(organization)/slider/-schemas/slider.schema'

export class SliderService {
  static async getSliders(): Promise<ResponseBody<ISlider[]>> {
    return await axiosInstance.get('/organizations/sliders')
  }

  static async createSlider(
    sliderData: SliderFormValues,
  ): Promise<ResponseBody<ISlider>> {
    const formData = new FormData()

    formData.append('title', sliderData.title ?? '')
    formData.append('link_url', sliderData.link_url ?? '')
    formData.append('sort_order', String(sliderData.sort_order ?? 0))
    formData.append('isactive', String(sliderData.isactive ?? 1))
    formData.append('remark', sliderData.remark ?? '')

    if (sliderData.image instanceof File) {
      formData.append('image', sliderData.image)
    }

    return await axiosInstance.post('/organizations/sliders/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  static async updateSlider(
    sliderId: number,
    sliderData: SliderFormValues,
  ): Promise<ResponseBody<ISlider>> {
    const formData = new FormData()

    formData.append('title', sliderData.title ?? '')
    formData.append('link_url', sliderData.link_url ?? '')
    formData.append('sort_order', String(sliderData.sort_order ?? 0))
    formData.append('isactive', String(sliderData.isactive ?? 1))
    formData.append('remark', sliderData.remark ?? '')

    if (sliderData.image instanceof File) {
      formData.append('image', sliderData.image)
    }

    return await axiosInstance.post(
      `/organizations/sliders/update/${sliderId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
  }

  static async deleteSlider(sliderId: number): Promise<void> {
    await axiosInstance.delete(`/organizations/sliders/delete/${sliderId}`)
  }
}
