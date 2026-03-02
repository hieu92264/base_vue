export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD',
  CONNECT = 'CONNECT',
}

export enum RequestHeader {
  AUTHORIZATION = 'Authorization',
  ACCEPT_LANGUAGE = 'Accept-Language',
  API_VERSION = 'X-Api-Version',
  CONTENT_TYPE = 'Content-Type',
  TENANT_ID = 'X-Tenant-Id',
  USER_COMPANY = 'X-User-Company',
  OTP = 'X-Otp',
}

export enum Language {
  VIETNAMESE = 'vi',
  ENGLISH = 'en',
  CHINESE = 'cn',
}

export enum CommonActions {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  READ = 'READ',
  CREATE_MANY = 'CREATE_MANY',
  UPDATE_MANY = 'UPDATE_MANY',
  DELETE_MANY = 'DELETE_MANY',
  CANCEL = 'CANCEL',
  SAVE = 'SAVE',
  SET_STATUS = 'SET_STATUS',
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
}

export enum RecordStatus {
  ACTIVE = 'Y',
  INACTIVE = 'N',
}

export enum WorkStatus {
  INTERN = 'INTERN',
  PROBATION = 'PROBATION',
  OFFICIAL = 'OFFICIAL',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
}

export const DateFormatterLocale: Record<Language, string> = {
  [Language.VIETNAMESE]: 'vi-VN',
  [Language.ENGLISH]: 'en-US',
  [Language.CHINESE]: 'zh-CN',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
}

export enum UserType {
  TENANT = 'tenant',
  LANDLORD = 'landlord',
}
