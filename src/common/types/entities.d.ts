import type { RecordStatus } from '@/common/constants/enums'

export interface IBaseEntity {
  id: number
  isactive: RecordStatus
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
  user_name_created: string | null
  user_name_updated: string | null
}

export interface IUser extends IBaseEntity {
  username: string
  email: string | null
  email_verified_at: string | null
  last_login_at: string | null
  last_login_ip: string | null
  locale: string | null
  remark: string | null
}
