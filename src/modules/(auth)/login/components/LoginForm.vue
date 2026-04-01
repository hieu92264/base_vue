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
          Đăng nhập tài khoản
        </h1>
        <p class="text-muted-foreground text-sm text-balance">
          Nhập thông tin bên dưới để đăng nhập vào tài khoản của bạn.
        </p>
      </div>

      <Field>
        <FieldLabel
          for="username"
          class="dark:text-zinc-300"
          >Tên đăng nhập</FieldLabel
        >
        <Input
          id="username"
          v-model="username"
          type="text"
          placeholder="hieu92264"
          :disabled="isPending"
          required
          class="dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </Field>

      <Field>
        <div class="flex items-center justify-between">
          <FieldLabel
            for="password"
            class="dark:text-zinc-300"
            >Mật khẩu</FieldLabel
          >
          <RouterLink
            to="/forgot-password"
            class="text-sm text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Quên mật khẩu?
          </RouterLink>
        </div>
        <PasswordInput
          id="password"
          v-model="password"
          :disabled="isPending"
          required
          class="dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
        />
      </Field>

      <Button
        type="submit"
        variant="outline"
        :disabled="isPending"
        class="w-full text-black hover:text-white hover:bg-black dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-100 dark:hover:text-black transition-colors"
      >
        <Loader2
          v-if="isPending"
          class="mr-2 h-4 w-4 animate-spin"
        />
        {{ isPending ? 'Vui lòng chờ...' : 'Đăng nhập' }}
      </Button>

      <div class="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Chưa có tài khoản?
        <RouterLink
          to="/register"
          class="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          Đăng ký
        </RouterLink>
      </div>
    </FieldGroup>
  </form>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import PasswordInput from '@/components/ui/password-input.vue'
import { cn } from '@/lib/utils'
import { useDoLoginMutation } from '@/modules/(auth)/hooks/use-auth'
import { Loader2 } from 'lucide-vue-next'
import { ref, type HTMLAttributes } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const username = ref('')
const password = ref('')

const { mutate, isPending } = useDoLoginMutation()

const handleSubmit = (event: Event) => {
  event.preventDefault()

  console.log(username.value, password.value)
  mutate({
    username: username.value,
    password: password.value,
  })
}
</script>
