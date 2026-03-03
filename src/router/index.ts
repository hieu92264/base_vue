import { createRouter, createWebHistory } from 'vue-router'
import authRoutes from '@/router/auth.routes'
import { useAuthStore } from '@/stores/auth.store'
import errorRoutes from '@/router/error.routes'
import { useUserStore } from '@/stores/user.store'
import { AuthService } from '@/services'
import BaseLayout from '@/components/layouts/BaseLayout.vue'
import organizationRoutes from '@/router/organization.routes'
import Dashboard from '@/views/Dashboard.vue'
import NProgress from '@/configs/nprogress.config'
import generalRoutes from '@/router/general.routes'

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
    ...generalRoutes,
    ...errorRoutes,
  ],
})

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const authStore = useAuthStore()
  const userStore = useUserStore()

  const isGuestOnly = to.matched.some((r) => r.meta.guestOnly === true)
  const isPublic = to.matched.some((r) => r.meta.public === true)

  if (authStore.access_token && !userStore.user) {
    try {
      const res = await AuthService.getCredentials()
      userStore.setProfile(res.data as any)
    } catch (e) {
      authStore.clearSession()
      userStore.clearProfile()
      return next({ name: 'auth.login' })
    }
  }

  if (!authStore.access_token && !isGuestOnly && !isPublic) {
    return next({ name: 'auth.login' })
  }

  if (authStore.access_token && isGuestOnly) {
    return next({ name: 'dashboard' })
  }

  const requiredCodes = to.matched
    .map((r) => r.meta.permissionCodes as string | string[] | undefined)
    .flat()
    .filter(Boolean) as string[]

  if (requiredCodes.length > 0) {
    const denied = requiredCodes.some((code) => !userStore.can(code))
    if (denied) return next({ name: '403' })
  }

  const needsAuth = to.matched.some((r) => r.meta.authOnly === true)
  if (needsAuth && !authStore.access_token) return next({ name: 'auth.login' })

  return next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
