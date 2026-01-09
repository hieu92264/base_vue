import type { IUser } from '@/common/types/entities'
import { defineStore } from 'pinia'

export interface IAuthState {
  user: IUser | null
  access_token: string | null
  refresh_token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): IAuthState => ({
    user: null,
    access_token: null,
    refresh_token: null,
  }),

  actions: {
    setUserProfile(profile: Partial<IUser>) {
      if (!this.user) {
        this.user = profile as IUser
      } else {
        this.user = { ...this.user, ...profile }
      }
    },

    setTokens(access: string, refresh: string) {
      this.access_token = access
      this.refresh_token = refresh
    },

    // setUserCompanyCode(company_code: string) {}

    resetCredentials() {
      this.user = null
      this.access_token = null
      this.refresh_token = null
    },
  },

  persist: {
    key: 'credentials',
    storage: localStorage,
  },
})
