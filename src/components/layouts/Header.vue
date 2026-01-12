<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { onMounted, onUnmounted, ref } from 'vue'

export interface HeaderProps {
  className?: string
  fixed?: boolean
}

const headerProps = withDefaults(defineProps<HeaderProps>(), {
  fixed: false,
})

const offset = ref(0)

const onScroll = () => {
  offset.value = document.body.scrollTop || document.documentElement.scrollTop
}

onMounted(() => {
  document.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  document.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header
    :class="
      cn(
        'z-50 h-16',
        fixed && 'header-fixed peer/header sticky top-0 w-[inherit]',
        offset > 10 && fixed ? 'shadow' : 'shadow-none',
        headerProps.className,
      )
    "
    v-bind="$attrs"
  >
    <div
      :class="
        cn(
          'relative flex h-full items-center gap-3 p-4 sm:gap-4',
          offset > 10 &&
            fixed &&
            'after:absolute after:inset-0 after:-z-10 after:bg-background/20 after:backdrop-blur-lg',
        )
      "
    >
      <SidebarTrigger
        variant="outline"
        class="max-md:scale-125"
      />
      <Separator
        orientation="vertical"
        class="h-6"
      />
      <slot />
    </div>
  </header>
</template>
