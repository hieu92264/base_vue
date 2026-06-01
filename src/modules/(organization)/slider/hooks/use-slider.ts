import i18n from '@/configs/i18n.config'
import type { SliderFormValues } from '@/modules/(organization)/slider/-schemas/slider.schema'
import { SliderService } from '@/services/slider.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

export enum SliderQueryKey {
  GET_SLIDERS = 'get_sliders',
}

const t = (key: string) => (i18n.global as any).t(key) as string

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
      toast.success(t('pages.organizationSliders.messages.createSuccess'))
    },
    onError: (error) => {
      console.error(error)
      toast.error(t('pages.organizationSliders.messages.createError'))
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
      toast.success(t('pages.organizationSliders.messages.updateSuccess'))
    },
    onError: (error) => {
      console.error(error)
      toast.error(t('pages.organizationSliders.messages.updateError'))
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
      toast.success(t('pages.organizationSliders.messages.deleteSuccess'))
    },
    onError: (error) => {
      console.error(error)
      toast.error(t('pages.organizationSliders.messages.deleteError'))
    },
  })
}
