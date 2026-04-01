import BaseLayout from '@/components/layouts/BaseLayout.vue'
import type { RouteRecordRaw } from 'vue-router'

const tenantRoutes: RouteRecordRaw[] = [
  {
    path: '/tenant/dashboard',
    name: 'tenant.dashboard',
    component: () => import('@/modules/(tenant)/dashboard/index.vue'),
    meta: { layouts: BaseLayout, authOnly: true, userTypes: ['tenant'] },
  },
]

export default tenantRoutes
