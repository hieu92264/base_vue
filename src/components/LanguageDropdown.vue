<script setup lang="ts">
import { Language } from '@/common/constants/enums'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-vue-next'
import { ref } from 'vue'

export interface LanguageProps {
  className?: string
}
const currentLocale = ref<Language>(Language.ENGLISH)

const handleLanguageChange = (locale: Language) => {
  currentLocale.value = locale
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
          {{ currentLocale.toUpperCase() }}
        </div>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem
        v-for="locale in Object.values(Language)"
        :key="locale"
        @select="handleLanguageChange(locale)"
      >
        {{ locale.toUpperCase() }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
