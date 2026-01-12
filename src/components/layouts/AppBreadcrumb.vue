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

const props = defineProps<{
  url: RouteRecordNameGeneric | ''
}>()

const breadcrumbItems = computed(() => {
  if (!props.url) return []
  return props.url.toString().split('.')
})

const collapsedItems = computed(() => {
  if (breadcrumbItems.value.length <= 3) return []
  return breadcrumbItems.value.slice(1, breadcrumbItems.value.length - 2)
})
</script>

<template>
  <Breadcrumb
    v-if="breadcrumbItems.length > 0"
    class="mb-4"
  >
    <BreadcrumbList>
      <BreadcrumbItem>
        <span class="uppercase">{{ breadcrumbItems[0] }}</span>
      </BreadcrumbItem>

      <template v-if="breadcrumbItems.length > 3">
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

      <template v-if="breadcrumbItems.length > 2">
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <span class="uppercase">{{
            breadcrumbItems[breadcrumbItems.length - 2]
          }}</span>
        </BreadcrumbItem>
      </template>

      <template v-if="breadcrumbItems.length > 1">
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage class="uppercase font-bold">
            {{ breadcrumbItems[breadcrumbItems.length - 1] }}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>
