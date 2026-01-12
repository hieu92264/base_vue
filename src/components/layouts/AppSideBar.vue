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
import { sidebarData } from '@/components/layouts/data/sidebar-data'

const { state } = useSidebar()
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

    <SidebarContent>
      <SidebarGroup
        v-for="group in sidebarData.navGroups"
        :key="group.title"
      >
        <SidebarGroupLabel v-if="state !== 'collapsed'">{{
          group.title
        }}</SidebarGroupLabel>

        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem
              v-for="item in group.items"
              :key="item.title"
            >
              <SidebarMenuButton
                as-child
                :tooltip="item.title"
              >
                <a
                  :href="item.url"
                  class="flex items-center"
                >
                  <component
                    :is="item.icon"
                    class="shrink-0"
                  />

                  <span
                    :class="[
                      'ml-2 transition-all duration-300 overflow-hidden whitespace-nowrap',
                      state === 'collapsed'
                        ? 'w-0 opacity-0'
                        : 'w-auto opacity-100',
                    ]"
                  >
                    {{ item.title }}
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
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
        © 2026 Greenland Inc.
      </div>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
