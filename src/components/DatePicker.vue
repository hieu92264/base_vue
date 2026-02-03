<script setup lang="ts">
import { DateFormatterLocale, Language } from '@/common/constants/enums'
import { useDateSync } from '@/common/utils/useDateSync'
import { Input } from '@/components/ui/input' // Giả định bạn có component Input
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useI18nStore } from '@/stores/i18n.store'
import { CalendarRangeIcon } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { format, parse, isValid } from 'date-fns' // Nên dùng date-fns để parse format dd/MM/yyyy

const props = defineProps<{
  modelValue: string | null | undefined
  placeholder?: string
  name?: string
}>()

const emit = defineEmits(['update:modelValue'])
const i18nStore = useI18nStore()
const isOpen = ref(false)

// 1. Quản lý giá trị hiển thị ở ô Input (VD: 01/01/2003)
const inputValue = ref('')

// Đồng bộ từ modelValue (ISO String) ra ô Input khi có dữ liệu từ server
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      inputValue.value = format(new Date(newVal), 'dd/MM/yyyy')
    } else {
      inputValue.value = ''
    }
  },
  { immediate: true },
)

// 2. Xử lý khi người dùng gõ tay
const handleInputChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const value = target.value
  inputValue.value = value

  // Nếu nhập đủ 10 ký tự (dd/mm/yyyy), thử parse xem có đúng ngày không
  if (value.length === 10) {
    const parsedDate = parse(value, 'dd/MM/yyyy', new Date())
    if (isValid(parsedDate)) {
      emit('update:modelValue', parsedDate.toISOString())
    }
  }
}

const dateValue = useDateSync(
  computed({
    get: () => props.modelValue,
    set: (val) => {
      const newValue = val ? new Date(val.toString()).toISOString() : null
      emit('update:modelValue', newValue)
      isOpen.value = false // Đóng popover sau khi chọn từ lịch
    },
  }),
)
</script>

<template>
  <div class="relative w-full">
    <input
      type="hidden"
      :name="name"
      :value="modelValue || ''"
    />

    <Popover v-model:open="isOpen">
      <PopoverTrigger as-child>
        <div class="relative">
          <Input
            :value="inputValue"
            :placeholder="placeholder || 'DD/MM/YYYY'"
            class="pl-10"
            @input="handleInputChange"
          />
          <CalendarRangeIcon
            class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
            @click="isOpen = true"
          />
        </div>
      </PopoverTrigger>

      <PopoverContent
        class="w-auto p-0"
        align="start"
      >
        <Calendar
          v-model="dateValue"
          initial-focus
          caption-layout="dropdown-buttons"
          :from-year="1900"
          :to-year="new Date().getFullYear()"
          @update:model-value="isOpen = false"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>
