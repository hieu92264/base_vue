import BaseLayout from '@/components/layouts/BaseLayout.vue'
import type { RouteRecordRaw } from 'vue-router'

const generalRoutes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'general.home',
    component: () => import('@/modules/(general)/home/index.vue'),
    meta: { layouts: BaseLayout, public: true, fullWidth: true },
  },
  {
    path: '/rooms',
    name: 'general.rooms',
    component: () =>
      import('@/modules/(general)/home/components/RoomListPage.vue'),
    meta: { layouts: BaseLayout, public: true, fullWidth: true },
  },
  {
    path: '/rooms/:slugOrId',
    name: 'general.home.room-detail',
    component: () =>
      import('@/modules/(general)/home/components/RoomDetailPage.vue'),
    meta: { layouts: BaseLayout, public: true, fullWidth: true },
  },
]

export default generalRoutes
