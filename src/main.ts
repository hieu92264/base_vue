import './assets/main.css'
import 'vue-sonner/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

const app = createApp(App)
const pinia = createPinia()
const queryClient = new QueryClient()

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(VueQueryPlugin, { queryClient })

router.getRoutes().forEach((route) => {
  console.log('Registered Path:', route.path)
})

app.mount('#app')
