<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-vue-next'
import { ref } from 'vue'

const modelValue = defineModel<string | undefined>('modelValue')

const props = defineProps<{
  // modelValue?: string
  placeholder?: string
  id?: string
}>()

const emit = defineEmits(['update:modelValue'])

const showPassword = ref(false)
const toggleVisibility = () => {
  showPassword.value = !showPassword.value
}

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="relative w-full">
    <!-- <Input
      :id="id"
      :type="showPassword ? 'text' : 'password'"
      :placeholder="placeholder || '••••••••'"
      :value="modelValue"
      @input="onInput"
    /> -->
    <Input
      :id="id"
      :type="showPassword ? 'text' : 'password'"
      :placeholder="placeholder || '••••••••'"
      :value="modelValue"
      v-model="modelValue"
      required
    />
    <Button
      type="button"
      variant="ghost"
      size="sm"
      class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
      @click="toggleVisibility"
    >
      <component
        :is="showPassword ? EyeOff : Eye"
        class="h-4 w-4 text-muted-foreground"
      />
      <span class="sr-only">
        {{ showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu' }}
      </span>
    </Button>
  </div>
</template>
