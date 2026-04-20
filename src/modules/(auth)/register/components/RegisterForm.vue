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
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const route = useRoute()
const { t } = useI18n()

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
          {{ t('auth.register.title') }}
        </h1>
        <p class="text-muted-foreground text-sm text-balance">
          {{ t('auth.register.description') }}
        </p>
      </div>

      <Field>
        <FieldLabel
          for="username"
          class="dark:text-zinc-300"
        >
          {{ t('auth.register.username') }}
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
          {{ t('auth.register.email') }}
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
          {{ t('auth.register.password') }}
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
          {{ t('auth.register.confirmPassword') }}
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
          {{ t('auth.register.confirmPasswordMismatch') }}
        </p>
      </Field>

      <Field>
        <FieldLabel
          for="user_type"
          class="dark:text-zinc-300"
        >
          {{ t('auth.register.roleLabel') }}
        </FieldLabel>

        <Select
          v-model="form.user_type"
          :disabled="isPending"
        >
          <SelectTrigger
            id="user_type"
            class="w-full"
          >
            <SelectValue :placeholder="t('auth.register.rolePlaceholder')" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="tenant">{{ t('auth.register.tenant') }}</SelectItem>
            <SelectItem value="landlord">{{ t('auth.register.landlord') }}</SelectItem>
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
        {{ isPending ? t('auth.register.pending') : t('auth.register.submit') }}
      </Button>

      <div class="text-center text-sm text-zinc-600 dark:text-zinc-400">
        {{ t('auth.register.hasAccount') }}
        <RouterLink
          :to="loginTarget"
          class="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          {{ t('common.login') }}
        </RouterLink>
      </div>
    </FieldGroup>
  </form>
</template>
