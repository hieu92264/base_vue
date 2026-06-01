import type { RoomFormValues } from '@/modules/(landlord)/rooms/-schemas/room.schema'
import {
  LandlordService,
  type LandlordRoomSearchParams,
} from '@/services/landlord.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, type ComputedRef, type Ref } from 'vue'
import { toast } from 'vue-sonner'

export enum LandlordRoomQueryKey {
  MY_ROOMS = 'landlord_my_rooms',
  MY_ROOM_DETAIL = 'landlord_my_room_detail',
  DASHBOARD = 'landlord_dashboard',
}

export const useLandlordRoomsQuery = (
  params: Ref<LandlordRoomSearchParams> | ComputedRef<LandlordRoomSearchParams>,
) => {
  return useQuery({
    queryKey: computed(() => [LandlordRoomQueryKey.MY_ROOMS, params.value]),
    queryFn: () => LandlordService.getMyRooms(params.value),
  })
}

export const useLandlordRoomDetailQuery = (id: Ref<number | null>) => {
  return useQuery({
    queryKey: computed(() => [LandlordRoomQueryKey.MY_ROOM_DETAIL, id.value]),
    queryFn: () => LandlordService.getMyRoomDetail(id.value as number),
    enabled: computed(() => !!id.value),
  })
}

export const useCreateLandlordRoomMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: RoomFormValues) =>
      LandlordService.createMyRoom(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [LandlordRoomQueryKey.MY_ROOMS],
      })
      queryClient.invalidateQueries({
        queryKey: [LandlordRoomQueryKey.DASHBOARD],
      })
      toast.success('Tạo tin đăng thành công')
    },
    onError: () => {
      toast.error('Tạo tin đăng thất bại')
    },
  })
}

export const useUpdateLandlordRoomMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: RoomFormValues }) =>
      LandlordService.updateMyRoom(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [LandlordRoomQueryKey.MY_ROOMS],
      })
      queryClient.invalidateQueries({
        queryKey: [LandlordRoomQueryKey.DASHBOARD],
      })
      toast.success('Cập nhật tin đăng thành công')
    },
    onError: () => {
      toast.error('Cập nhật tin đăng thất bại')
    },
  })
}

export const useDeleteLandlordRoomMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => LandlordService.deleteMyRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [LandlordRoomQueryKey.MY_ROOMS],
      })
      queryClient.invalidateQueries({
        queryKey: [LandlordRoomQueryKey.DASHBOARD],
      })
      toast.success('Xóa tin đăng thành công')
    },
    onError: () => {
      toast.error('Xóa tin đăng thất bại')
    },
  })
}
