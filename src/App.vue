<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import { AppConfigs } from '@/configs/app.config'
import { useColorMode } from '@vueuse/core'
import { computed, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()
const mode = useColorMode({
  storageKey: 'theme',
})

const layout = computed(() => {
  return route.meta.layouts || 'div'
})

watch(mode, () => {
  const root = window.document.documentElement
  root.classList.add('no-transition')

  requestAnimationFrame(() => {
    root.classList.remove('no-transition')
  })
})
</script>

<template>
  <Toaster
    class="pointer-events-auto"
    position="bottom-right"
    :duration="AppConfigs.TOAST_DURATION"
  />
  <component :is="layout">
    <RouterView />
  </component>
</template>
