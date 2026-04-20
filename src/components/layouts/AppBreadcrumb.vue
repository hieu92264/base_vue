<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { computed } from 'vue'
import type { RouteRecordNameGeneric } from 'vue-router'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  url: RouteRecordNameGeneric | ''
}>()

const { t, te } = useI18n()

const breadcrumbItems = computed(() => {
  if (!props.url) return []
  return props.url.toString().split('.')
})

const resolveLabel = (index: number) => {
  const segments = breadcrumbItems.value.slice(0, index + 1)
  const baseKey = `routes.${segments.join('.')}`
  const groupKey = `${baseKey}._self`

  if (index < breadcrumbItems.value.length - 1 && te(groupKey)) {
    return t(groupKey)
  }

  if (te(baseKey)) {
    return t(baseKey)
  }

  const segment = breadcrumbItems.value[index] || ''
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const translatedItems = computed(() =>
  breadcrumbItems.value.map((_, index) => resolveLabel(index)),
)

const collapsedItems = computed(() => {
  if (translatedItems.value.length <= 3) return []
  return translatedItems.value.slice(1, translatedItems.value.length - 2)
})
</script>

<template>
  <Breadcrumb
    v-if="translatedItems.length > 0"
    class="mb-4"
  >
    <BreadcrumbList>
      <BreadcrumbItem>
        <span class="uppercase">{{ translatedItems[0] }}</span>
      </BreadcrumbItem>

      <template v-if="translatedItems.length > 3">
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger class="flex items-center gap-1">
              <BreadcrumbEllipsis class="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                v-for="item in collapsedItems"
                :key="item"
              >
                <span class="uppercase">{{ item }}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
      </template>

      <template v-if="translatedItems.length > 2">
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <span class="uppercase">{{
            translatedItems[translatedItems.length - 2]
          }}</span>
        </BreadcrumbItem>
      </template>

      <template v-if="translatedItems.length > 1">
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage class="uppercase font-bold">
            {{ translatedItems[translatedItems.length - 1] }}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>
