import type { IEmployee, IPermission, IUser } from '@/common/types/entities'
import { defineStore } from 'pinia'

export interface IAuthState {
  user: IUser | null
  access_token: string | null
  refresh_token: string | null
  employee?: IEmployee | null
  permissions?: IPermission[] | null
}

export interface IAuthData {
  user: IUser
  employee: IEmployee | null
  permissions: IPermission[]
}

export const useAuthStore = defineStore('auth', {
  state: (): IAuthState => ({
    user: null,
    access_token: null,
    refresh_token: null,
    employee: null,
    permissions: [] as IPermission[],
  }),

  getters: {
    permissionCodes: (state) =>
      new Set((state.permissions ?? []).map((p) => p.code)),
  },

  actions: {
    setAuthData(data: IAuthData | null) {
      console.log('Setting auth data:', data)
      if (data) {
        this.user = data.user
        this.employee = data.employee
        this.permissions = data.permissions
        console.log('Auth data set:', data)
      } else {
        this.resetCredentials()
      }
    },

    setTokens(access: string, refresh: string) {
      this.access_token = access
      this.refresh_token = refresh
    },

    getLocale(): string {
      return this.user?.locale || 'en'
    },

    // setUserCompanyCode(company_code: string) {}

    resetCredentials() {
      this.user = null
      this.access_token = null
      this.refresh_token = null
      this.employee = null
      this.permissions = []
    },

    hasPermission(code: string): boolean {
      if (this.user?.username === 'admin') return true
      return this.permissionCodes.has(code)
    },

    isAuthenticated(): boolean {
      return !!this.access_token && !!this.user
    },
  },

  persist: true,

  // persist: {
  //   key: 'credentials',
  //   storage: localStorage,
  // },
})
