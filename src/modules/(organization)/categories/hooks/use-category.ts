import i18n from '@/configs/i18n.config'
import type { CategoryFormValues } from '@/modules/(organization)/categories/-schemas/category.schema'
import { CategoryService } from '@/services/category.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

export enum CategoryQueryKey {
  GET_CATEGORIES = 'get_categories',
}

const t = (key: string) => (i18n.global as any).t(key) as string

export const useGetCategoriesQuery = () => {
  return useQuery({
    queryKey: [CategoryQueryKey.GET_CATEGORIES],
    queryFn: CategoryService.getCategories,
  })
}

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: CategoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CategoryQueryKey.GET_CATEGORIES],
      })
      toast.success(t('pages.organizationCategories.messages.createSuccess'))
    },
    onError: (error) => {
      console.error('Error creating category:', error)
      toast.error(t('pages.organizationCategories.messages.createError'))
    },
  })
}

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      categoryId,
      categoryData,
    }: {
      categoryId: number
      categoryData: CategoryFormValues
    }) => CategoryService.updateCategory(categoryId, categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CategoryQueryKey.GET_CATEGORIES],
      })
      toast.success(t('pages.organizationCategories.messages.updateSuccess'))
    },
    onError: (error) => {
      console.error('Error updating category:', error)
      toast.error(t('pages.organizationCategories.messages.updateError'))
    },
  })
}

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: CategoryService.deleteCategory,
    onSuccess: (_, deletedID) => {
      queryClient.setQueryData(
        [CategoryQueryKey.GET_CATEGORIES],
        (oldData: any) => {
          if (!oldData) return []
          if (Array.isArray(oldData)) {
            return oldData.filter(
              (item) => String(item.id) !== String(deletedID),
            )
          }
          const updated = { ...oldData }
          const keyToDelete = Object.keys(updated).find(
            (key) => String(updated[key].id) === String(deletedID),
          )
          if (keyToDelete) delete updated[keyToDelete]
          return updated
        },
      )
      toast.success(t('pages.organizationCategories.messages.deleteSuccess'))
    },
    onError: (error) => {
      console.error('Error deleting category:', error)
      toast.error(t('pages.organizationCategories.messages.deleteError'))
    },
  })
}
