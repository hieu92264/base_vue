<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <div class="h-svh">
    <div
      class="m-auto flex h-full w-full flex-col items-center justify-center gap-2"
    >
      <h1 class="text-[7rem] leading-tight font-bold">403</h1>
      <span class="font-medium">{{ t('errors.403.title') }}</span>
      <p class="text-center text-muted-foreground">
        {{ t('errors.403.description') }}
      </p>
      <div class="mt-6 flex gap-4">
        <Button
          variant="outline"
          @click="router.back()"
        >
          {{ t('common.back') }}
        </Button>
        <Button @click="router.push({ name: 'dashboard' })">
          {{ t('common.home') }}
        </Button>
      </div>
    </div>
  </div>
</template>
