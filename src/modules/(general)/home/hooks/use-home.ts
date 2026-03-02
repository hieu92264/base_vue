import type { ContactFormValues } from '@/modules/(general)/home/-schemas/contact.schema'
import { HomeService } from '@/services'
import { useMutation, useQuery } from '@tanstack/vue-query'

export enum HomeQueryKeys {
  GET_SLIDERS = 'get_sliders',
  GET_FEATURE_ROOMS = 'get_feature_rooms',
  GET_CITIES = 'get_cities',
  GET_DISTRICTS = 'get_districts',
  GET_WARDS = 'get_wards',
}

type TQueryKey = readonly [typeof HomeQueryKeys, ...any[]]

export const useSlidersQuery = () => {
  return useQuery({
    queryKey: [HomeQueryKeys.GET_SLIDERS],
    queryFn: HomeService.sliders,
  })
}

export const useFeatureRoomsQuery = () => {
  return useQuery({
    queryKey: [HomeQueryKeys.GET_FEATURE_ROOMS],
    queryFn: HomeService.featureRooms,
  })
}

export const useCitiesQuery = () => {
  return useQuery({
    queryKey: [HomeQueryKeys.GET_CITIES],
    queryFn: HomeService.cities,
  })
}

export const useDistrictsQuery = () => {
  return useQuery({
    queryKey: [HomeQueryKeys.GET_DISTRICTS],
    queryFn: HomeService.districts,
  })
}

export const useWardsQuery = () => {
  return useQuery({
    queryKey: [HomeQueryKeys.GET_WARDS],
    queryFn: HomeService.wards,
  })
}

export const useRoomDetailsQuery = (roomId: number) => {
  return useQuery({
    queryKey: ['room_details', roomId],
    queryFn: () => HomeService.roomDetails(roomId),
  })
}

export const useContactMutaion = () => {
  return useMutation({
    mutationFn: ({
      formData,
      id,
    }: {
      formData: ContactFormValues
      id: string
    }) => HomeService.contact(formData, id),
    onSuccess: () => {
      console.log('Contact sent success')
    },
    onError: (err) => {
      console.error('Contact sent error', err)
    },
  })
}
