import { computed, type Ref } from 'vue'
import { parseDate, type DateValue } from '@internationalized/date'

export function useDateSync(dateRef: Ref<string | null | undefined>) {
  return computed({
    get: () => {
      const value = dateRef.value
      if (value && typeof value === 'string') {
        try {
          const dateString = value.split('T')[0]

          return parseDate(dateString as string)
        } catch (e) {
          return undefined
        }
      }
      return undefined
    },
    set: (val: DateValue | undefined | null) => {
      dateRef.value = val ? val.toString() : null
    },
  })
}
