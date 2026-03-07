import BaseLayout from '@/components/layouts/BaseLayout.vue'
import type { RouteRecordRaw } from 'vue-router'

const organizationRoutes: RouteRecordRaw[] = [
  {
    path: '/organizations/permissions',
    name: 'organizations.permission',
    component: () => import('@/modules/(organization)/permission/index.vue'),
    meta: { layouts: BaseLayout, permissionCodes: 'org.permissions' },
  },
  {
    path: '/organizations/user',
    name: 'organizations.user',
    component: () => import('@/modules/(organization)/user/index.vue'),
    meta: { layouts: BaseLayout, permissionCodes: 'org.users' },
  },
  {
    path: '/organizations/employees',
    name: 'organizations.employees',
    component: () => import('@/modules/(organization)/employee/index.vue'),
    meta: { layouts: BaseLayout, permissionCodes: 'org.employees' },
  },
  {
    path: '/organizations/user-permissions',
    name: 'organizations.user-permissions',
    component: () =>
      import('@/modules/(organization)/user_permissions/index.vue'),
    meta: { layouts: BaseLayout, permissionCodes: 'org.user-permissions' },
  },
  {
    path: '/organizations/categories',
    name: 'organizations.categories',
    component: () => import('@/modules/(organization)/categories/index.vue'),
    meta: { layouts: BaseLayout, permissionCodes: 'org.categories' },
  },
]

export default organizationRoutes
