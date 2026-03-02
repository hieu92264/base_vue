<script setup lang="ts">
import { format, isValid, parse } from 'date-fns'
import { computed, ref, watch } from 'vue'
import { CalendarDate, type DateValue } from '@internationalized/date'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { CalendarRangeIcon, XIcon } from 'lucide-vue-next'
import { Calendar } from '@/components/ui/calendar'

const props = defineProps<{
  modelValue?: string | undefined // yyyy-MM-dd | ''
  placeholder?: string
  name?: string
  onBlur?: (e: FocusEvent) => void
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void // luôn string
}>()

const isOpen = ref(false)
const inputValue = ref('')
const isTyping = ref(false)

function onlyDigits(s: string) {
  return s.replace(/\D/g, '')
}

function formatAsDDMMYYYY(raw: string) {
  const digits = onlyDigits(raw).slice(0, 8)
  const dd = digits.slice(0, 2)
  const mm = digits.slice(2, 4)
  const yyyy = digits.slice(4, 8)

  let out = dd
  if (mm.length) out += '/' + mm
  if (yyyy.length) out += '/' + yyyy
  return out
}

function commitDDMMYYYY(masked: string) {
  if (masked.length !== 10) return false
  const parsed = parse(masked, 'dd/MM/yyyy', new Date())
  if (!isValid(parsed)) return false

  emit('update:modelValue', format(parsed, 'yyyy-MM-dd'))
  return true
}

function commitYYYYMMDD(raw: string) {
  // accept: 2026-03-02
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return false
  const parsed = parse(raw, 'yyyy-MM-dd', new Date())
  if (!isValid(parsed)) return false

  emit('update:modelValue', raw)
  return true
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (isTyping.value) return

    if (!newVal) {
      inputValue.value = ''
      return
    }

    const d = parse(newVal, 'yyyy-MM-dd', new Date())
    inputValue.value = isValid(d) ? format(d, 'dd/MM/yyyy') : ''
  },
  { immediate: true },
)

const handleModelUpdate = (payload: string | number) => {
  isTyping.value = true
  const raw = String(payload).trim()

  // ✅ cho phép paste yyyy-MM-dd
  if (commitYYYYMMDD(raw)) {
    const d = parse(raw, 'yyyy-MM-dd', new Date())
    inputValue.value = isValid(d) ? format(d, 'dd/MM/yyyy') : ''
    isTyping.value = false
    return
  }

  const masked = formatAsDDMMYYYY(raw)
  inputValue.value = masked

  if (masked.length === 10) {
    const ok = commitDDMMYYYY(masked)
    if (ok) {
      inputValue.value = masked
      isTyping.value = false
    }
  }
}

const handleBlur = (e: FocusEvent) => {
  if (inputValue.value === '') {
    emit('update:modelValue', '')
    isTyping.value = false
    props.onBlur?.(e)
    return
  }

  commitDDMMYYYY(inputValue.value)

  isTyping.value = false
  props.onBlur?.(e)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    if (inputValue.value === '') emit('update:modelValue', '')
    else commitDDMMYYYY(inputValue.value)
    isTyping.value = false
  }
  if (e.key === 'Escape') {
    isOpen.value = false
  }
}

const clearValue = () => {
  inputValue.value = ''
  emit('update:modelValue', '') // like input type=date
  isOpen.value = false
  isTyping.value = false
}

const dateValue = computed<DateValue | undefined>({
  get: () => {
    if (!props.modelValue) return undefined
    const d = parse(props.modelValue, 'yyyy-MM-dd', new Date())
    if (!isValid(d)) return undefined
    return new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
  },
  set: (val) => {
    if (!val) {
      emit('update:modelValue', '')
      isOpen.value = false
      return
    }

    const y = val.year
    const m = String(val.month).padStart(2, '0')
    const day = String(val.day).padStart(2, '0')

    const iso = `${y}-${m}-${day}`
    emit('update:modelValue', iso)

    inputValue.value = `${day}/${m}/${y}`
    isTyping.value = false
    isOpen.value = false
  },
})

const showClear = computed(() => !!props.modelValue && !props.disabled)
</script>

<template>
  <div class="relative w-full">
    <!-- giống input type=date: submit sẽ là yyyy-MM-dd hoặc '' -->
    <input
      type="hidden"
      :name="name"
      :value="modelValue || ''"
    />

    <Popover v-model:open="isOpen">
      <PopoverTrigger as-child>
        <div
          class="relative"
          @click="!disabled && (isOpen = true)"
        >
          <Input
            :model-value="inputValue"
            :placeholder="placeholder || 'DD/MM/YYYY'"
            class="pl-10 pr-10"
            :disabled="disabled"
            inputmode="numeric"
            autocomplete="off"
            @update:modelValue="handleModelUpdate"
            @keydown="handleKeydown"
            @blur="handleBlur"
          />

          <button
            type="button"
            class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            :disabled="disabled"
            @click.stop="isOpen = true"
            aria-label="Open calendar"
          >
            <CalendarRangeIcon class="h-4 w-4" />
          </button>

          <button
            v-if="showClear"
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            @click.stop="clearValue"
            aria-label="Clear date"
          >
            <XIcon class="h-4 w-4" />
          </button>
        </div>
      </PopoverTrigger>

      <PopoverContent
        class="w-auto p-2"
        align="start"
        @mousedown.prevent
      >
        <Calendar
          v-model="dateValue"
          initial-focus
        />
      </PopoverContent>
    </Popover>
  </div>
</template>
