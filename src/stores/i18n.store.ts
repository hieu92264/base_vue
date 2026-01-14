import { Language } from '@/common/constants/enums'
import i18n from '@/configs/i18n.config'
import { defineStore } from 'pinia'

export const useI18nStore = defineStore('i18n', {
  state: () => ({
    locale: Language.VIETNAMESE as Language,
  }),

  actions: {
    setLocale(locale: Language) {
      this.locale = locale
      i18n.global.locale = locale
      console.log('i18n locale set to: ', i18n.global.locale)
    },
  },

  persist: true,
})
