// import type { IEmployee, IPermission, IUser } from '@/common/types/entities'
// import { defineStore } from 'pinia'

// export interface IUserStore {
//   user: IUser | null
//   employee?: IEmployee | null
//   permissions?: IPermission[] | null
// }

// export const useUserStore = defineStore('user', {
//   state: (): IUserStore => ({
//     user: null as IUser | null,
//     employee: null as IEmployee | null,
//     permissions: [] as IPermission[],
//   }),

//   getters: {
//     permissionCodes: (state): Set<string> => {
//       console.log(
//         'Calculating permission codes from permissions:',
//         state.permissions,
//       )
//       return new Set((state.permissions ?? []).map((p) => p.code))
//     },
//   },

//   actions: {
//     setProfile(data: IUserStore) {
//       console.log('Setting user data:', data)
//       this.user = data.user
//       this.employee = data.employee
//       this.permissions = data.permissions
//     },

//     getLocale(): string {
//       return this.user?.locale || 'en'
//     },

//     clearProfile() {
//       this.user = null
//       this.employee = null
//       this.permissions = []
//     },

//     can(code: string): boolean {
//       if (this.user?.username === 'admin') return true
//       if (!code) return false
//       return this.permissionCodes.has(code)
//     },
//   },
// })

import type { IEmployee, IPermission, IUser } from '@/common/types/entities'
import { defineStore } from 'pinia'

export interface IUserStore {
  user: IUser | null
  employee?: IEmployee | null
  permissions?: IPermission[] | null
}

export const useUserStore = defineStore('user', {
  state: (): IUserStore => ({
    user: null,
    employee: null,
    permissions: [],
  }),

  getters: {
    permissionCodeList: (state): string[] =>
      (state.permissions ?? []).map((p) => p.code),

    isAdmin: (state): boolean => {
      return state.user?.username === 'admin'
    },
  },

  actions: {
    setProfile(data: IUserStore) {
      this.user = data.user
      this.employee = data.employee
      this.permissions = data.permissions ?? []
    },

    clearProfile() {
      this.user = null
      this.employee = null
      this.permissions = []
    },

    can(requiredCode: string): boolean {
      if (!requiredCode) return false

      const codes = this.permissionCodeList

      if (this.isAdmin) return true
      if (codes.includes('*') || codes.includes('admin.full_access'))
        return true

      if (codes.includes(requiredCode)) return true

      if (requiredCode.includes('*')) {
        const [prefix = ''] = requiredCode.split('*')
        if (!prefix) return true
        return codes.some((c) => c.startsWith(prefix))
      }

      for (const c of codes) {
        if (c.includes('*')) {
          const prefix = c.split('*')[0]
          if (prefix && requiredCode.startsWith(prefix)) return true
        }
      }

      const parts = requiredCode.split('.')
      while (parts.length > 1) {
        parts.pop()
        const parent = parts.join('.')
        if (codes.includes(parent)) return true
      }

      return false
    },
  },
})
