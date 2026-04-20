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
          {{ t('auth.resetPassword.title') }}
        </h1>
        <p class="text-muted-foreground text-sm text-balance">
          {{ t('auth.resetPassword.description') }}
        </p>
      </div>

      <div
        v-if="!token || !email"
        class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300"
      >
        {{ t('auth.resetPassword.invalidLink') }}
      </div>

      <Field>
        <FieldLabel
          for="email"
          class="dark:text-zinc-300"
          >{{ t('auth.register.email') }}</FieldLabel
        >
        <Input
          id="email"
          :model-value="email"
          type="email"
          disabled
          class="dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
        />
      </Field>

      <Field>
        <FieldLabel
          for="password"
          class="dark:text-zinc-300"
          >{{ t('auth.resetPassword.newPassword') }}</FieldLabel
        >
        <PasswordInput
          id="password"
          v-model="password"
          :disabled="isPending || !token || !email"
          required
          class="dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
        />
      </Field>

      <Field>
        <FieldLabel
          for="password_confirmation"
          class="dark:text-zinc-300"
        >
          {{ t('auth.resetPassword.confirmPassword') }}
        </FieldLabel>
        <PasswordInput
          id="password_confirmation"
          v-model="passwordConfirmation"
          :disabled="isPending || !token || !email"
          required
          class="dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
        />
        <p
          v-if="passwordMismatch"
          class="text-xs text-red-500 mt-1"
        >
          {{ t('auth.resetPassword.confirmPasswordMismatch') }}
        </p>
      </Field>

      <Button
        type="submit"
        variant="outline"
        :disabled="isPending || !token || !email || passwordMismatch"
        class="w-full text-black hover:text-white hover:bg-black dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-100 dark:hover:text-black transition-colors"
      >
        <Loader2
          v-if="isPending"
          class="mr-2 h-4 w-4 animate-spin"
        />
        {{
          isPending
            ? t('auth.resetPassword.pending')
            : t('auth.resetPassword.submit')
        }}
      </Button>

      <div class="text-center text-sm text-zinc-600 dark:text-zinc-400">
        <RouterLink
          to="/login"
          class="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          {{ t('auth.resetPassword.backToLogin') }}
        </RouterLink>
      </div>
    </FieldGroup>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import PasswordInput from '@/components/ui/password-input.vue'
import { cn } from '@/lib/utils'

import { useResetPasswordMutation } from '@/modules/(auth)/hooks/use-auth'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const token = computed(() => String(route.query.token || ''))
const email = computed(() => String(route.query.email || ''))

const password = ref('')
const passwordConfirmation = ref('')

const passwordMismatch = computed(() => {
  return (
    password.value.length > 0 &&
    passwordConfirmation.value.length > 0 &&
    password.value !== passwordConfirmation.value
  )
})

const { mutate, isPending } = useResetPasswordMutation()

const handleSubmit = () => {
  if (!token.value || !email.value) return
  if (passwordMismatch.value) return

  mutate(
    {
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    },
    {
      onSuccess: () => {
        router.replace('/login')
      },
    },
  )
}
</script>
