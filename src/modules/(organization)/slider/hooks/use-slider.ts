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
      toast.success('Slider created successfully')
    },
    onError: (error) => {
      console.error(error)
      toast.error('Failed to create slider')
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
      toast.success('Slider updated successfully')
    },
    onError: (error) => {
      console.error(error)
      toast.error('Failed to update slider')
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
      toast.success('Slider deleted successfully')
    },
    onError: (error) => {
      console.error(error)
      toast.error('Failed to delete slider')
    },
  })
}
