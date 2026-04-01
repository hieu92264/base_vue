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
          Quên mật khẩu
        </h1>
        <p class="text-muted-foreground text-sm text-balance">
          Nhập email của bạn và chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
        </p>
      </div>

      <Field>
        <FieldLabel
          for="email"
          class="dark:text-zinc-300"
          >Email</FieldLabel
        >
        <Input
          id="email"
          v-model="email"
          type="email"
          placeholder="you@example.com"
          :disabled="isPending"
          required
          class="dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-500"
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
        {{ isPending ? 'Vui lòng chờ...' : 'Gửi liên kết đặt lại' }}
      </Button>

      <div class="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Đã nhớ mật khẩu?
        <RouterLink
          to="/login"
          class="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          Quay lại đăng nhập
        </RouterLink>
      </div>
    </FieldGroup>
  </form>
</template>

<script setup lang="ts">
import { ref, type HTMLAttributes } from 'vue'
import { RouterLink } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// Hook bạn tự tạo theo style useDoRegisterMutation
import { useForgotPasswordMutation } from '@/modules/(auth)/hooks/use-auth'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const email = ref('')

const { mutate, isPending } = useForgotPasswordMutation()

const handleSubmit = () => {
  mutate({ email: email.value })
}
</script>
