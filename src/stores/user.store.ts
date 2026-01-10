import type { IEmployee, IPermission, IUser } from '@/common/types/entities'
import { defineStore } from 'pinia'

export interface IUserStore {
  user: IUser | null
  employee?: IEmployee | null
  permissions?: IPermission[] | null
}

export const useUserStore = defineStore('user', {
  state: (): IUserStore => ({
    user: null as IUser | null,
    employee: null as IEmployee | null,
    permissions: [] as IPermission[],
  }),

  getters: {
    permissionCodes: (state): Set<string> =>
      new Set((state.permissions ?? []).map((p) => p.code)),
  },

  actions: {
    setProfile(data: IUserStore) {
      console.log('Setting user data:', data)
      this.user = data.user
      this.employee = data.employee
      this.permissions = data.permissions
    },

    getLocale(): string {
      return this.user?.locale || 'en'
    },

    clearProfile() {
      this.user = null
      this.employee = null
      this.permissions = []
    },

    can(code: string): boolean {
      if (this.user?.username === 'admin') return true
      return this.permissionCodes.has(code)
    },
  },
})
