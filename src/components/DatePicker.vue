<script setup lang="ts">
import { useDateSync } from '@/common/utils/useDateSync'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { DateFormatter } from '@internationalized/date'
import { CalendarRangeIcon } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string | null | undefined
  placeholder?: string
  name?: string
}>()

const emit = defineEmits(['update:modelValue'])

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const dateValue = useDateSync(
  computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
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

    <Popover v-slot="{ close }">
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          :class="[
            'w-full justify-start text-left font-normal',
            !modelValue && 'text-muted-foreground',
          ]"
        >
          <CalendarRangeIcon class="mr-2 h-4 w-4" />
          {{
            modelValue
              ? df.format(new Date(modelValue))
              : placeholder || 'Pick a date'
          }}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        class="w-auto p-0"
        align="start"
      >
        <Calendar
          v-model="dateValue"
          :placeholder="dateValue"
          initial-focus
          @update:model-value="close"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>
