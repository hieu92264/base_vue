<script setup lang="ts">
import Loading from '@/components/Loading.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDoLogoutMutation } from '@/modules/(auth)/hooks/use-auth'
import { useUserStore } from '@/stores/user.store'
import { LogOut, Settings, User } from 'lucide-vue-next'
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const userStore = useUserStore()
const { mutate, isPending } = useDoLogoutMutation()
const labels = computed(() => ({
  logout: t('common.logout'),
}))

const authLinks = computed(() => ({
  login: {
    path: '/login',
    query: route.path ? { redirect: route.fullPath } : {},
  },
  register: {
    path: '/register',
    query: route.path ? { redirect: route.fullPath } : {},
  },
}))
</script>

<template>
  <div
    v-if="!userStore.user"
    class="flex items-center gap-2"
  >
    <Button
      as-child
      variant="outline"
      class="rounded-xl"
    >
      <RouterLink :to="authLinks.login">Đăng nhập</RouterLink>
    </Button>
    <Button
      as-child
      class="rounded-xl"
    >
      <RouterLink :to="authLinks.register">Đăng ký</RouterLink>
    </Button>
  </div>

  <DropdownMenu
    v-else
    :modal="false"
  >
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="relative h-9 w-9 rounded-full ring-offset-background transition-all hover:ring-2 hover:ring-ring hover:ring-offset-2 focus-visible:ring-2"
      >
        <Avatar class="h-9 w-9">
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="user"
          />
          <AvatarFallback class="bg-primary/10 text-primary uppercase">
            {{ userStore.user?.username?.charAt(0) || 'U' }}
          </AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      class="w-56"
      align="end"
      :side-offset="8"
    >
      <DropdownMenuLabel class="font-normal">
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium leading-none">
            {{ userStore.user?.username || 'Tên người dùng' }}
          </p>
          <p class="text-xs leading-none text-muted-foreground">
            {{ userStore.user?.email || 'Chưa có email' }}
          </p>
        </div>
      </DropdownMenuLabel>

      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuItem class="cursor-pointer">
          <User class="mr-2 h-4 w-4" />
          <span>Hồ sơ cá nhân</span>
        </DropdownMenuItem>
        <DropdownMenuItem class="cursor-pointer">
          <Settings class="mr-2 h-4 w-4" />
          <span>Cài đặt</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        @click="mutate()"
        class="flex cursor-pointer items-center transition-colors text-red-600 focus:bg-red-500 focus:text-white dark:text-red-400 dark:focus:bg-red-600 dark:focus:text-white"
      >
        <LogOut class="mr-2 h-4 w-4" />
        <span>{{ labels.logout }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  <Loading v-if="isPending" />
</template>
