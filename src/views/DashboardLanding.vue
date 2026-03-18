<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.store'

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  const role = userStore.user?.profile?.user_type

  if (role === 'admin' && userStore.can('org.dashboard')) {
    router.replace({ name: 'organizations.dashboard' })
    return
  }

  if (role === 'landlord') {
    router.replace({ name: 'landlord.dashboard' })
    return
  }

  router.replace({ name: 'home' })
})
</script>

<template>
  <div class="p-6 text-sm text-muted-foreground">Đang chuyển hướng...</div>
</template>
