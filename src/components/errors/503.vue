<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="h-svh">
    <div
      class="m-auto flex h-full w-full flex-col items-center justify-center gap-2"
    >
      <h1 class="text-[7rem] leading-tight font-bold">503</h1>
      <span class="font-medium">{{ t('errors.503.title') }}</span>
      <p class="text-center text-muted-foreground">
        {{ t('errors.503.description') }}
      </p>
      <div class="mt-6 flex gap-4">
        <Button variant="outline">{{ t('errors.503.action') }}</Button>
      </div>
    </div>
  </div>
</template>
