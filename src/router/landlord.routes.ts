import BaseLayout from '@/components/layouts/BaseLayout.vue'
import type { RouteRecordRaw } from 'vue-router'

const landlordRoutes: RouteRecordRaw[] = [
  {
    path: '/landlord/dashboard',
    name: 'landlord.dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { layouts: BaseLayout, authOnly: true, userTypes: ['landlord'] },
  },
  {
    path: '/landlord/my-rooms',
    name: 'landlord.my-rooms',
    component: () => import('@/modules/(landlord)/rooms/index.vue'),
    meta: { layouts: BaseLayout, authOnly: true, userTypes: ['landlord'] },
  },
  {
    path: '/landlord/my-rooms/create',
    name: 'landlord.my-rooms.create',
    component: () => import('@/modules/(landlord)/rooms/form.vue'),
    meta: { layouts: BaseLayout, authOnly: true, userTypes: ['landlord'] },
  },
  {
    path: '/landlord/my-rooms/:id/edit',
    name: 'landlord.my-rooms.edit',
    component: () => import('@/modules/(landlord)/rooms/form.vue'),
    meta: { layouts: BaseLayout, authOnly: true, userTypes: ['landlord'] },
  },
  {
    path: '/landlord/contacts',
    name: 'landlord.contacts',
    component: () => import('@/modules/(landlord)/contacts/index.vue'),
    meta: { layouts: BaseLayout, authOnly: true, userTypes: ['landlord'] },
  },
  {
    path: '/landlord/deals',
    name: 'landlord.deals',
    component: () => import('@/modules/(landlord)/deals/index.vue'),
    meta: { layouts: BaseLayout, authOnly: true, userTypes: ['landlord'] },
  },
]

export default landlordRoutes
