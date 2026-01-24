import type { RouteRecordRaw } from 'vue-router'

const errorRoutes: RouteRecordRaw[] = [
  {
    path: '/401',
    name: '401',
    component: () => import('@/components/errors/401.vue'),
    meta: { title: 'Unauthorized' },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/components/errors/403.vue'),
    meta: { title: 'Forbidden' },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/components/errors/404.vue'),
    meta: { title: 'Page Not Found' },
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/components/errors/500.vue'),
    meta: { title: 'Internal Server Error' },
  },
  {
    path: '/503',
    name: '503',
    component: () => import('@/components/errors/503.vue'),
    meta: { title: 'Service Unavailable' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/components/errors/404.vue'),
    meta: { title: '404 Not Found' },
  },
]

export default errorRoutes
