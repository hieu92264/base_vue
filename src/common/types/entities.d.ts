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
  title?: string | null
  image_url: string | null
  image_path?: string | null
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

  post_status?: 'pending' | 'approved' | 'rejected' | 'hidden'
  moderated_by?: number | null
  moderated_at?: string | null
  moderation_note?: string | null
  availability_status?: 'available' | 'reserved' | 'occupied' | 'hidden'
}

export interface IRoomPhoto {
  id: number
  room_id: number
  photo_url: string | null
  photo_path?: string | null
  photo_version?: number | string | null
  preview_url?: string | null
  is_cover: boolean
  sort_order: number
  created_at?: string | null
  updated_at?: string | null
}

export type CommentModerationStatus = 'pending' | 'visible' | 'hidden'

export interface IComment {
  id: number
  room_id: number
  user_id: number
  content: string
  rating: number | null
  status: CommentModerationStatus
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null

  user?: IUser | null
  room?: IRoom | null
  replies?: ICommentReply[] | null

  user_name?: string | null
  user_avatar?: string | null
  room_title?: string | null
  room_slug?: string | null
}

export interface ICommentReply {
  id: number
  comment_id: number
  user_id: number
  content: string
  status: CommentModerationStatus
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null

  user?: IUser | null

  user_name?: string | null
  user_avatar?: string | null
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

export type ContactStatus =
  | 'new'
  | 'contacted'
  | 'viewing_scheduled'
  | 'viewed'
  | 'negotiating'
  | 'waiting_decision'
  | 'won'
  | 'lost'
  | 'cancelled'

export interface IContact {
  id: number
  room_id?: number | null
  owner_user_id?: number | null

  name: string | null
  email: string | null
  phone: string | null
  subject: string | null
  message: string | null

  move_in_date?: string | null
  preferred_viewing_time?: string | null

  status: ContactStatus
  status_note?: string | null
  lost_reason?: string | null
  next_follow_up_at?: string | null
  last_contacted_at?: string | null
  viewing_at?: string | null
  source?: string | null

  handled_by?: number | null
  handled_at?: string | null
  handled_by_name?: string | null

  room_title?: string | null
  room_slug?: string | null
  room_address?: string | null
  room_price?: number | null

  owner_name?: string | null
  owner_phone?: string | null

  created_at: string | null
  updated_at: string | null

  tenant_user_id?: number | null
  tenant_name?: string | null
  tenant_phone?: string | null
  tenant_email?: string | null
}

export interface IBooking {
  id: number
  room_id: number
  tenant_user_id: number | null
  landlord_user_id: number
  start_date: string | null
  end_date: string | null
  agreed_price: number
  currency: string
  commission_percent: number
  commission_amount: number
  status: string
  note: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null

  room?: IRoom | null
  tenant?: IUser | null
  landlord?: IUser | null
}

export interface IDeal {
  id: number
  room_id: number
  contact_id?: number | null
  tenant_user_id?: number | null
  landlord_user_id: number

  status: 'draft' | 'reserved' | 'confirmed' | 'cancelled' | 'completed'

  agreed_price: number
  currency?: string | null
  commission_percent?: number | null
  commission_amount?: number | null

  start_date?: string | null
  end_date?: string | null

  reserved_at?: string | null
  confirmed_at?: string | null
  cancelled_at?: string | null
  completed_at?: string | null

  note?: string | null

  tenant_name?: string | null
  tenant_phone?: string | null
  tenant_email?: string | null

  landlord_name?: string | null
  landlord_phone?: string | null

  room?: IRoom | null
  contact?: IContact | null
  tenant?: IUser | null
  landlord?: IUser | null

  room_title?: string | null
  room_slug?: string | null
  room_address?: string | null
  room_availability_status?: string | null

  contact_name?: string | null
  contact_phone?: string | null
  contact_email?: string | null

  created_at?: string | null
  updated_at?: string | null
  deleted_at?: string | null
}

export interface IPermissionUser {
  id: number
  user_id: number
  permission_id: number
  created_at: string | null
  updated_at: string | null
}
