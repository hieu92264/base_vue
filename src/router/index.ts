import {
  createRouter,
  createWebHistory,
  type NavigationGuardWithThis,
} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import authRoutes from '@/router/auth.routes'
import { useAuthStore } from '@/stores/auth.store'
import { record } from 'zod'
import errorRoutes from '@/router/error.routes'

const layouts = {
  blank: () => import('@/components/layouts/BlankLayout.vue'),
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    ...authRoutes,
    ...errorRoutes,
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.guestOnly && authStore.isAuthenticated()) {
    return next({ name: 'home' })
  }

  const accessDenied = to.matched.some((record) => {
    const code = record.meta.permissionCodes as string
    return code && !authStore.hasPermission(code)
  })

  if (accessDenied) {
    return next({ name: '403' })
  }

  return next()
})

export default router
