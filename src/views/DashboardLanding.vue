<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.store'

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  const isLandlord =
    userStore.user?.profile?.user_type === 'landlord' ||
    userStore.user?.username === 'admin'

  if (userStore.can('org.dashboard')) {
    router.replace({ name: 'organizations.dashboard' })
    return
  }

  if (isLandlord) {
    router.replace({ name: 'landlord.dashboard' })
    return
  }

  router.replace({ name: 'home' })
})
</script>

<template>
  <div class="p-6 text-sm text-muted-foreground">Đang chuyển hướng...</div>
</template>
