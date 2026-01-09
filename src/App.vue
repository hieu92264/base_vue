<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import { AppConfigs } from '@/configs/app.config'
import { RouterView } from 'vue-router'
</script>

<template>
  <Toaster
    class="pointer-events-auto"
    position="bottom-right"
    :duration="AppConfigs.TOAST_DURATION"
  />
  <RouterView />
</template>
