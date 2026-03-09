import type { ContactFormValues } from '@/modules/(general)/home/-schemas/contact.schema'
import { HomeService, type RoomSearchParams } from '@/services/home.service'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { computed, type ComputedRef, type Ref } from 'vue'

export enum HomeQueryKeys {
  GET_SLIDERS = 'get_sliders',
  GET_FEATURE_ROOMS = 'get_feature_rooms',
  GET_CITIES = 'get_cities',
  GET_DISTRICTS = 'get_districts',
  GET_WARDS = 'get_wards',
  GET_ROOMS = 'get_rooms',
  GET_ROOM_DETAIL = 'get_room_detail',
}

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

export const useRoomsQuery = (
  params: Ref<RoomSearchParams> | ComputedRef<RoomSearchParams>,
) => {
  return useQuery({
    queryKey: computed(() => [HomeQueryKeys.GET_ROOMS, params.value]),
    queryFn: () => HomeService.searchRooms(params.value),
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

export const useRoomDetailsQuery = (
  slugOrId: Ref<string> | ComputedRef<string>,
) => {
  return useQuery({
    queryKey: computed(() => [HomeQueryKeys.GET_ROOM_DETAIL, slugOrId.value]),
    queryFn: () => HomeService.roomDetails(slugOrId.value),
    enabled: computed(() => !!slugOrId.value),
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
  })
}
