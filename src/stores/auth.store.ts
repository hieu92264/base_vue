import { defineStore } from 'pinia'

export interface IAuthState {
  access_token: string | null
  refresh_token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): IAuthState => ({
    access_token: null,
    refresh_token: null,
  }),

  actions: {
    saveSession(access: string, refresh: string) {
      this.access_token = access
      this.refresh_token = refresh
    },

    clearSession() {
      this.access_token = null
      this.refresh_token = null
    },
  },

  persist: {
    key: 'auth_session',
    storage: window.localStorage,
  },
})
