<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import { AppConfigs } from '@/configs/app.config'
import { useColorMode } from '@vueuse/core'
import { watch } from 'vue'
import { RouterView } from 'vue-router'

const mode = useColorMode({
  storageKey: 'theme',
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
  <RouterView />
</template>
