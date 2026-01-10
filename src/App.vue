<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import { AppConfigs } from '@/configs/app.config'
import { AuthService } from '@/services'
import { useAuthStore } from '@/stores/auth.store'
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

const authStore = useAuthStore()

onMounted(async () => {
  if (authStore.access_token && !authStore.user) {
    try {
      const res = await AuthService.getCredentials()
      authStore.setAuthData(res)
    } catch (e) {
      authStore.resetCredentials()
    }
  }
})
</script>

<template>
  <Toaster
    class="pointer-events-auto"
    position="bottom-right"
    :duration="AppConfigs.TOAST_DURATION"
  />
  <RouterView />
</template>
