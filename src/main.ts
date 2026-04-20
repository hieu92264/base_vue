import './assets/main.css'
import 'vue-sonner/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import i18n from '@/configs/i18n.config'
import { useI18nStore } from '@/stores/i18n.store'

const app = createApp(App)
const pinia = createPinia()
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(i18n)

const i18nStore = useI18nStore()
i18nStore.setLocale(i18nStore.locale)

app.use(router)
app.use(VueQueryPlugin, { queryClient })

router.getRoutes().forEach((route) => {
  console.log('Registered Path:', route.path)
})

app.mount('#app')
