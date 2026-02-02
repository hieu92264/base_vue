import { Language } from '@/common/constants/enums'
import { createI18n } from 'vue-i18n'

import en from '@/i18n/en'
import vi from '@/i18n/vi'
import cn from '@/i18n/cn'

const i18n = createI18n<
  any,
  Language.ENGLISH | Language.CHINESE | Language.VIETNAMESE
>({
  legacy: false,
  locale: Language.VIETNAMESE,
  fallbackLocale: Language.ENGLISH,
  messages: {
    en,
    vi,
    cn,
  },
})

export default i18n
