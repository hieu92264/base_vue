import type { RouteRecordRaw } from 'vue-router'

const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'auth.login',
    component: () => import('@/modules/(auth)/login/index.vue'),
    meta: { layout: 'blank', guestOnly: true },
  },
  {
    path: '/register',
    name: 'auth.register',
    component: () => import('@/modules/(auth)/register/index.vue'),
    meta: { layout: 'blank', guestOnly: true },
  },
  {
    path: '/verify-email/success',
    name: 'auth.verify-email.success',
    component: () =>
      import('@/modules/(auth)/register/components/verify-email-success.vue'),
    meta: { layout: 'blank', guestOnly: true },
  },
  {
    path: '/forgot-password',
    name: 'auth.forgot-password',
    component: () => import('@/modules/(auth)/forgot-password/index.vue'),
    meta: { layout: 'blank', guestOnly: true },
  },
  {
    path: '/reset-password',
    name: 'auth.reset-password',
    component: () => import('@/modules/(auth)/reset-password/index.vue'),
    meta: { layout: 'blank', guestOnly: true },
  },
]

export default authRoutes
