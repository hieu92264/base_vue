<script setup lang="ts">
import { computed, reactive, type HTMLAttributes } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import PasswordInput from '@/components/ui/password-input.vue'
import { cn } from '@/lib/utils'
import { useDoRegisterMutation } from '@/modules/(auth)/hooks/use-auth'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const route = useRoute()

const form = reactive({
  username: '',
  email: '',
  password: '',
  verify_password: '',
  user_type: 'tenant',
})

const passwordMismatch = computed(() => {
  return (
    form.password.length > 0 &&
    form.verify_password.length > 0 &&
    form.password !== form.verify_password
  )
})

const { mutate, isPending } = useDoRegisterMutation()

const handleSubmit = (event: Event) => {
  event.preventDefault()
  if (passwordMismatch.value) return

  mutate({
    username: form.username,
    email: form.email,
    password: form.password,
    verify_password: form.verify_password,
    user_type: form.user_type as any,
  })
}

const loginTarget = computed(() => ({
  path: '/login',
  query: route.query.redirect ? { redirect: String(route.query.redirect) } : {},
}))
</script>

<template>
  <form
    :class="
      cn(
        'flex flex-col gap-6 p-6 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm',
        props.class,
      )
    "
    @submit.prevent="handleSubmit"
  >
    <FieldGroup>
      <div class="flex flex-col items-center gap-1 text-center">
        <h1 class="text-2xl font-bold text-zinc-950 dark:text-zinc-50">
          Tạo tài khoản
        </h1>
        <p class="text-muted-foreground text-sm text-balance">
          Điền thông tin bên dưới để tạo tài khoản.
        </p>
      </div>

      <Field>
        <FieldLabel
          for="username"
          class="dark:text-zinc-300"
        >
          Tên đăng nhập
        </FieldLabel>
        <Input
          id="username"
          v-model="form.username"
          type="text"
          placeholder="hieu92264"
          :disabled="isPending"
          required
          class="dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </Field>

      <Field>
        <FieldLabel
          for="email"
          class="dark:text-zinc-300"
        >
          Email
        </FieldLabel>
        <Input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="hieu92264@st.vimaru.edu.vn"
          :disabled="isPending"
          required
          class="dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </Field>

      <Field>
        <FieldLabel
          for="password"
          class="dark:text-zinc-300"
        >
          Mật khẩu
        </FieldLabel>
        <PasswordInput
          id="password"
          v-model="form.password"
          :disabled="isPending"
          required
          class="dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
        />
      </Field>

      <Field>
        <FieldLabel
          for="verify_password"
          class="dark:text-zinc-300"
        >
          Xác nhận mật khẩu
        </FieldLabel>
        <PasswordInput
          id="verify_password"
          v-model="form.verify_password"
          :disabled="isPending"
          required
          class="dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
        />
        <p
          v-if="passwordMismatch"
          class="mt-1 text-xs text-red-500"
        >
          Mật khẩu xác nhận không khớp.
        </p>
      </Field>

      <Field>
        <FieldLabel
          for="user_type"
          class="dark:text-zinc-300"
        >
          Bạn đăng ký với vai trò
        </FieldLabel>

        <Select
          v-model="form.user_type"
          :disabled="isPending"
        >
          <SelectTrigger
            id="user_type"
            class="w-full"
          >
            <SelectValue placeholder="Chọn vai trò" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="tenant">Người thuê</SelectItem>
            <SelectItem value="landlord">Chủ nhà</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Button
        type="submit"
        variant="outline"
        :disabled="isPending || passwordMismatch"
        class="w-full text-black hover:text-white hover:bg-black dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-100 dark:hover:text-black transition-colors"
      >
        <Loader2
          v-if="isPending"
          class="mr-2 h-4 w-4 animate-spin"
        />
        {{ isPending ? 'Vui lòng chờ...' : 'Đăng ký' }}
      </Button>

      <div class="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Đã có tài khoản?
        <RouterLink
          :to="loginTarget"
          class="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          Đăng nhập
        </RouterLink>
      </div>
    </FieldGroup>
  </form>
</template>
