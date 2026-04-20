<script setup lang="ts">
import { Language } from '@/common/constants/enums'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18nStore } from '@/stores/i18n.store'
import { Globe } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

export interface LanguageProps {
  className?: string
}

const i18nStore = useI18nStore()
const { t } = useI18n()

const handleLanguageChange = (locale: Language) => {
  i18nStore.setLocale(locale)
}
</script>

<template>
  <DropdownMenu v-bind="$attrs">
    <DropdownMenuTrigger as-child>
      <Button
        variant="outline"
        class="w-16 justify-center"
      >
        <div class="flex items-center gap-2">
          <Globe />
          {{ i18nStore.locale.toUpperCase() }}
        </div>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem
        v-for="locale in Object.values(Language)"
        :key="locale"
        @select="handleLanguageChange(locale)"
      >
        {{ t(`locales.${locale}`) }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
