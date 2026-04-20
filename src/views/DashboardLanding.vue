<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.store'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

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

  if (role === 'tenant') {
    router.replace({ name: 'tenant.dashboard' })
    return
  }

  router.replace({ name: 'general.home' })
})
</script>

<template>
  <div class="p-6 text-sm text-muted-foreground">{{ t('common.redirecting') }}</div>
</template>
