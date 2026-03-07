import type { ICategory } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import type { CategoryFormValues } from '@/modules/(organization)/categories/-schemas/category.schema'

export class CategoryService {
  static async getCategories(): Promise<ResponseBody<ICategory>> {
    const response = await axiosInstance.get('/organizations/categories')
    return response.data
  }

  static async deleteCategory(categoryId: number): Promise<any> {
    await axiosInstance.delete(`/organizations/categories/delete/${categoryId}`)
  }

  static async createCategory(
    categoryData: CategoryFormValues,
  ): Promise<ResponseBody<ICategory>> {
    const response = await axiosInstance.post(
      '/organizations/categories/create',
      categoryData,
    )
    return response.data
  }

  static async updateCategory(
    categoryId: number,
    categoryData: CategoryFormValues,
  ): Promise<ResponseBody<ICategory>> {
    const response = await axiosInstance.patch(
      `/organizations/categories/update/${categoryId}`,
      categoryData,
    )
    return response.data
  }
}
