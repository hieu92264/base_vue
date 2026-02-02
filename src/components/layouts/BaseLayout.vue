<script setup lang="ts">
import LanguageDropdown from '@/components/LanguageDropdown.vue'
import AppBreadcrumb from '@/components/layouts/AppBreadcrumb.vue'
import AppSideBar from '@/components/layouts/AppSideBar.vue'
import Header from '@/components/layouts/Header.vue'
import ModeToggle from '@/components/ModeToggle.vue'
import ProfileDropdown from '@/components/ProfileDropdown.vue'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <SidebarProvider>
    <AppSideBar />
    <SidebarInset class="min-w-0 flex-1">
      <Header fixed>
        <div class="ms-auto flex-1 flex items-center justify-between space-x-4">
          <div>
            <AppBreadcrumb :url="route.name" />
          </div>
          <div class="flex items-center gap-2">
            <LanguageDropdown />
            <ModeToggle />
            <ProfileDropdown />
          </div>
        </div>
      </Header>

      <main class="flex-1 p-4 flex flex-col min-w-0 w-full">
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
