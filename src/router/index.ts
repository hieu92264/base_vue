import { createRouter, createWebHistory } from 'vue-router'
import authRoutes from '@/router/auth.routes'
import { useAuthStore } from '@/stores/auth.store'
import errorRoutes from '@/router/error.routes'
import { useUserStore } from '@/stores/user.store'
import { AuthService } from '@/services'
import BaseLayout from '@/components/layouts/BaseLayout.vue'
import organizationRoutes from '@/router/organization.routes'
import Dashboard from '@/views/Dashboard.vue'

// export const layouts = {
//   blank: () => import('@/components/layouts/BlankLayout.vue'),
//   base: () => import('@/components/layouts/BaseLayout.vue'),
// }

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      meta: { layouts: BaseLayout },
    },
    ...authRoutes,
    ...organizationRoutes,
    ...errorRoutes,
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const userStore = useUserStore()

  if (authStore.access_token && !userStore.user) {
    try {
      const res = await AuthService.getCredentials()
      userStore.setProfile(res.data as any)
      return next()
    } catch (e) {
      authStore.clearSession()
      userStore.clearProfile()
      return next({ name: 'auth.login' })
    }
  }

  const isGuestPage = to.meta.guestOnly

  if (!authStore.access_token && !isGuestPage) {
    return next({ name: 'auth.login' })
  }

  if (authStore.access_token && isGuestPage) {
    return next({ name: 'home' })
  }

  const accessDenied = to.matched.some((record) => {
    const code = record.meta.permissionCodes as string
    return code && !userStore.can(code)
  })

  if (accessDenied) {
    return next({ name: '403' })
  }

  return next()
})

export default router
