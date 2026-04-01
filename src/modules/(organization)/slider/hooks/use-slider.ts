import type { SliderFormValues } from '@/modules/(organization)/slider/-schemas/slider.schema'
import { SliderService } from '@/services/slider.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

export enum SliderQueryKey {
  GET_SLIDERS = 'get_sliders',
}

export const useGetSlidersQuery = () => {
  return useQuery({
    queryKey: [SliderQueryKey.GET_SLIDERS],
    queryFn: SliderService.getSliders,
  })
}

export const useCreateSliderMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: SliderService.createSlider,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SliderQueryKey.GET_SLIDERS],
      })
      toast.success('Tạo slider thành công')
    },
    onError: (error) => {
      console.error(error)
      toast.error('Tạo slider thất bại')
    },
  })
}

export const useUpdateSliderMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      sliderId,
      sliderData,
    }: {
      sliderId: number
      sliderData: SliderFormValues
    }) => SliderService.updateSlider(sliderId, sliderData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SliderQueryKey.GET_SLIDERS],
      })
      toast.success('Cập nhật slider thành công')
    },
    onError: (error) => {
      console.error(error)
      toast.error('Cập nhật slider thất bại')
    },
  })
}

export const useDeleteSliderMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: SliderService.deleteSlider,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SliderQueryKey.GET_SLIDERS],
      })
      toast.success('Xóa slider thành công')
    },
    onError: (error) => {
      console.error(error)
      toast.error('Xóa slider thất bại')
    },
  })
}
