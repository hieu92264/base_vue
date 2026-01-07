import type { IUser } from '@/common/types/entities'
import { defineStore } from 'pinia'

export interface IAuthState {
  user: IUser | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): IAuthState => ({
    user: null,
    token: null,
  }),

  actions: {
    setUserProfile(profile: Partial<IUser>) {
      if (!this.user) {
        this.user = profile as IUser
      } else {
        this.user = { ...this.user, ...profile }
      }
    },

    setAccessToken(token: string) {
      this.token = token
    },

    // setUserCompanyCode(company_code: string) {}

    resetCredentials() {
      this.user = null
      this.token = null
    },
  },

  persist: {
    key: 'credentials',
    storage: localStorage,
  },
})
