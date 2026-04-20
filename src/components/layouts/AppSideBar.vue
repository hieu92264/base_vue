<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from '@/components/ui/sidebar'
import GreenlandLogo from '@/components/GreenlandLogo.vue'
import {
  getSidebarData,
  type NavItem,
} from '@/components/layouts/data/sidebar-data'
import { computed, ref, watchEffect } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()

const normalizePath = (path = '') => path.replace(/\/+$/, '') || '/'

const isPathActive = (url: string) => {
  if (!url) return false

  const current = normalizePath(route.path)
  const target = normalizePath(url)

  return current === target || current.startsWith(target + '/')
}

const isItemActive = (item: NavItem): boolean => {
  if (item.url && isPathActive(item.url)) return true
  return !!item.children?.some((child) => isItemActive(child))
}

const { state } = useSidebar()

const sidebarData = computed(() => getSidebarData())

const openMenus = ref<Record<string, boolean>>({})

watchEffect(() => {
  sidebarData.value.navGroups.forEach((group) => {
    group.items.forEach((item) => {
      if (item.children?.length && isItemActive(item)) {
        openMenus.value[item.title] = true
      }
    })
  })
})
</script>

<template>
  <Sidebar
    collapsible="icon"
    variant="sidebar"
    style="--sidebar-width-icon: 3.5rem"
    class="border-r"
  >
    <SidebarHeader>
      <GreenlandLogo />
    </SidebarHeader>

    <SidebarContent class="overflow-x-hidden">
      <SidebarGroup
        v-for="group in sidebarData.navGroups"
        :key="group.title"
      >
        <SidebarGroupLabel v-if="state !== 'collapsed' && group.title">
          {{ group.title }}
        </SidebarGroupLabel>

        <SidebarGroupContent>
          <SidebarMenu>
            <template
              v-for="item in group.items"
              :key="item.title"
            >
              <SidebarMenuItem v-if="item.children && item.children.length">
                <SidebarMenuButton
                  :tooltip="item.title"
                  @click="openMenus[item.title] = !openMenus[item.title]"
                  :class="[
                    'transition-colors',
                    isItemActive(item)
                      ? 'bg-muted text-foreground font-semibold border-l-2 border-primary'
                      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                  ]"
                >
                  <component :is="item.icon" />

                  <span v-if="state !== 'collapsed'">
                    {{ item.title }}
                  </span>

                  <ChevronDown
                    v-if="state !== 'collapsed'"
                    class="ml-auto size-4 transition-transform"
                    :class="openMenus[item.title] ? 'rotate-180' : ''"
                  />
                </SidebarMenuButton>

                <SidebarMenu
                  v-if="openMenus[item.title]"
                  :class="state === 'collapsed' ? 'hidden' : 'ml-6!'"
                >
                  <SidebarMenuItem
                    v-for="child in item.children"
                    :key="child.title"
                  >
                    <SidebarMenuButton
                      as-child
                      :tooltip="child.title"
                      :class="[
                        'transition-colors',
                        isItemActive(child)
                          ? 'bg-muted text-foreground font-semibold border-l-2 border-primary'
                          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                      ]"
                    >
                      <RouterLink :to="child.url || '#'">
                        <component :is="child.icon" />
                        <span>{{ child.title }}</span>
                      </RouterLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarMenuItem>

              <SidebarMenuItem v-else>
                <SidebarMenuButton
                  as-child
                  :tooltip="item.title"
                  :class="[
                    isItemActive(item)
                      ? 'bg-primary text-primary-foreground font-medium'
                      : '',
                  ]"
                >
                  <RouterLink :to="item.url || '#'">
                    <component :is="item.icon" />
                    <span>{{ item.title }}</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </template>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <div
        :class="[
          'p-4 text-sm text-center transition-all duration-300 overflow-hidden whitespace-nowrap',
          state === 'collapsed' ? 'w-0 opacity-0' : 'w-auto opacity-100',
        ]"
      >
        {{ t('layout.footer', { year: 2026 }) }}
      </div>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
