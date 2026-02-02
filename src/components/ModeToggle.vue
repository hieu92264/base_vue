<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { useColorMode } from '@vueuse/core'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const mode = useColorMode({
  storageKey: 'theme',
})

const { t } = useI18n()

const labels = computed(() => ({
  light: t('common.theme.light'),
  dark: t('common.theme.dark'),
  system: t('common.theme.system'),
}))
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline">
        <Icon
          icon="radix-icons:moon"
          class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />
        <Icon
          icon="radix-icons:sun"
          class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent>
      <DropdownMenuItem @click="mode = 'light'">
        {{ labels.light }}
      </DropdownMenuItem>
      <DropdownMenuItem @click="mode = 'dark'">
        {{ labels.dark }}
      </DropdownMenuItem>
      <DropdownMenuItem @click="mode = 'auto'">
        {{ labels.system }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
