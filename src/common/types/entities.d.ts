import type {
  RecordStatus,
  WorkStatus,
  BookingStatus,
  UserType,
} from '@/common/constants/enums'

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
  profile?: IUserProfile | null
}

export interface IEmployee extends IBaseEntity {
  user_id: number | null
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

export interface ISlider extends IBaseEntity {
  title?: string
  image_url: string | undefined
  link_url?: string | null
  sort_order: number
  remark?: string | null
}

export interface ICity extends IBaseEntity {
  code: string
  name: string
  sort_order: number
}

export interface IDistrict extends IBaseEntity {
  city_id?: number
  code: string
  name: string
  sort_order: number
}

export interface IWard extends IBaseEntity {
  code: string
  name: string
  district_id: number
  sort_order: number
}

export interface ICategory extends IBaseEntity {
  code: string
  name: string
  slug: string
  sort_order: number
  remark: string | null
}

export interface IPostType extends IBaseEntity {
  code: string
  name: string
  priority: number
  default_days: number
  price: number
  remark: string | null
}

export interface IUserProfile extends IBaseEntity {
  user_id: number
  full_name: string | null
  phone_number: string | null
  avatar_url: string | null
  address: string | null
  zalo: string | null
  facebook: string | null
  user_type: UserType
  remark: string | null
}

/**
 * Refresh token rows are typically not returned to UI in full;
 * keep this for admin/debug use.
 */
export interface IRefreshToken extends IBaseEntity {
  user_id: number
  token: string
  expires_at: string
}

export interface IRoom extends IBaseEntity {
  owner_user_id: number
  category_id: number | null
  post_type_id: number | null

  city_id: number | null
  district_id: number | null
  ward_id: number | null

  title: string
  slug: string
  address: string | null

  price: number
  area: number | null
  description: string | null

  booking_status: BookingStatus

  owner?: IUser | null
  category?: ICategory | null
  post_type?: IPostType | null
  city?: ICity | null
  district?: IDistrict | null
  ward?: IWard | null

  photos?: IRoomPhoto[] | null
}

export interface IRoomPhoto {
  id: number
  room_id: number
  photo_url: string | null
  is_cover: boolean
  sort_order: number
}

export type CommentVisibilityStatus = 'visible' | 'hidden'

export interface IComment {
  id: number
  room_id: number
  user_id: number
  content: string
  rating: number | null
  status: CommentVisibilityStatus
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null

  user?: IUser | null
  room?: IRoom | null
  replies?: ICommentReply[] | null
}

export interface ICommentReply {
  id: number
  comment_id: number
  user_id: number
  content: string
  status: CommentVisibilityStatus
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null

  user?: IUser | null
}

export type NewsStatus = 'draft' | 'published' | 'hidden'

export interface INews extends IBaseEntity {
  author_user_id: number | null
  title: string
  slug: string
  thumbnail_url: string | null
  content: string | null
  status: NewsStatus
  published_at: string | null
  remark: string | null

  author?: IUser | null
}

export type ContactStatus = 'new' | 'processing' | 'done'

export interface IContact {
  id: number
  name: string | null
  email: string | null
  phone: string | null
  subject: string | null
  message: string | null
  status: ContactStatus
  created_at: string | null
  updated_at: string | null
}

export interface IBooking {
  id: number
  room_id: number
  tenant_user_id: number
  landlord_user_id: number
  start_date: string | null
  end_date: string | null
  agreed_price: number
  currency: string
  commission_percent: number
  commission_amount: number
  status: BookingStatus
  note: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null

  room?: IRoom | null
  tenant?: IUser | null
  landlord?: IUser | null
}

export interface IPermissionUser {
  id: number
  user_id: number
  permission_id: number
  created_at: string | null
  updated_at: string | null
}
