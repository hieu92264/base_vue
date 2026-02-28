import { HomeService } from '@/services'
import { useQuery } from '@tanstack/vue-query'

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
