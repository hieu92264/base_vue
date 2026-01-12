import BaseLayout from '@/components/layouts/BaseLayout.vue'
import type { RouteRecordRaw } from 'vue-router'

const organizationRoutes: RouteRecordRaw[] = [
  {
    path: '/organizations/permission',
    name: 'organizations.permission',
    component: () => import('@/modules/(organization)/permission/index.vue'),
    meta: { layouts: BaseLayout },
  },
  {
    path: '/organizations/user',
    name: 'organizations.user',
    component: () => import('@/modules/(organization)/user/index.vue'),
    meta: { layouts: BaseLayout },
  },
]

export default organizationRoutes
