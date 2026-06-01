import { Language } from '@/common/constants/enums'
import { createI18n } from 'vue-i18n'

import en from '@/i18n/en'
import vi from '@/i18n/vi'

const i18n = createI18n<any, Language.ENGLISH | Language.VIETNAMESE>({
  legacy: false,
  locale: Language.VIETNAMESE,
  fallbackLocale: Language.ENGLISH,
  messages: {
    en,
    vi,
  },
})

export default i18n
