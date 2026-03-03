import BaseLayout from '@/components/layouts/BaseLayout.vue'
import type { RouteRecordRaw } from 'vue-router'

const generalRoutes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'general.home',
    component: () => import('@/modules/(general)/home/index.vue'),
    meta: { layouts: BaseLayout, authOnly: true },
  },
  {
    path: '/rooms/:id',
    name: 'general.home.room-detail',
    component: () =>
      import('@/modules/(general)/home/components/RoomDetailPage.vue'),
    meta: { layouts: BaseLayout, authOnly: true },
  },
]

export default generalRoutes
