<script setup lang="ts">
import { useRouter } from 'vue-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface GeneralErrorProps {
  className?: string
  minimal?: boolean
}

const props = withDefaults(defineProps<GeneralErrorProps>(), {
  minimal: false,
})

const router = useRouter()

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

      <span class="font-medium"> Đã có lỗi xảy ra </span>

      <p class="text-center text-muted-foreground">
        Xin lỗi vì sự bất tiện này. <br />
        Vui lòng thử lại sau.
      </p>

      <div
        v-if="!minimal"
        class="mt-6 flex gap-4"
      >
        <Button
          variant="outline"
          @click="goBack"
        >
          Quay lại
        </Button>
        <Button @click="goHome"> Về trang chủ </Button>
      </div>
    </div>
  </div>
</template>
