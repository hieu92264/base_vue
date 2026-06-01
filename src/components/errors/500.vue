<script setup lang="ts">
import { useRouter } from 'vue-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useI18n } from 'vue-i18n'

interface GeneralErrorProps {
  className?: string
  minimal?: boolean
}

const props = withDefaults(defineProps<GeneralErrorProps>(), {
  minimal: false,
})

const router = useRouter()
const { t } = useI18n()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div :class="cn('h-svh w-full', props.className)">
    <div
      class="m-auto flex h-full w-full flex-col items-center justify-center gap-2"
    >
      <h1
        v-if="!minimal"
        class="text-[7rem] leading-tight font-bold"
      >
        500
      </h1>

      <span class="font-medium">{{ t('errors.500.title') }}</span>

      <p class="text-center text-muted-foreground">
        {{ t('errors.500.description') }}
      </p>

      <div
        v-if="!minimal"
        class="mt-6 flex gap-4"
      >
        <Button
          variant="outline"
          @click="goBack"
        >
          {{ t('common.back') }}
        </Button>
        <Button @click="goHome">{{ t('common.home') }}</Button>
      </div>
    </div>
  </div>
</template>
