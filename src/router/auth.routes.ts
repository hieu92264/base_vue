import type { RouteRecordRaw } from 'vue-router'

const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'auth.login',
    component: () => import('@/modules/(auth)/login/index.vue'),
    meta: { layout: 'blank' },
  },
]

export default authRoutes
