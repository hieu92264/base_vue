import { Language } from '@/common/constants/enums'
import i18n from '@/configs/i18n.config'
import { defineStore } from 'pinia'

export const useI18nStore = defineStore('i18n', {
  state: () => ({
    locale: Language.VIETNAMESE as Language,
  }),

  actions: {
    setLocale(newLocale: Language) {
      this.locale = newLocale

      if (i18n.mode === 'legacy') {
        ;(i18n.global.locale as any) = newLocale
      } else {
        ;(i18n.global.locale as any).value = newLocale
      }

      document.documentElement.lang = newLocale
    },
  },
  persist: true,
})
