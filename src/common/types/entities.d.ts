import type { RecordStatus, WorkStatus } from '@/common/constants/enums'

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
  employee?: IEmployee | null
  permissions?: IPermission[] | null
}

export interface IEmployee extends IBaseEntity {
  user_id: number
  employee_code: string
  full_name: string | null
  phone: string | null
  email: string | null
  dob: string | null
  avatar_url: string | null
  status: WorkStatus | null
  join_date: string | null
  terminate_date: string | null
  remark: string | null
}

export interface IPermission extends IBaseEntity {
  code: string
  name: string
  parent_id: number | null
  url: string
}
