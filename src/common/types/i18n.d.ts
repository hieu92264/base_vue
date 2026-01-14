import vi from '@/i18n/vi'
import { DefineLocaleMessage } from 'vue-i18n'

type MessageSchema = typeof vi

declare module 'vue-i18n' {
  //
  export interface DefineLocaleMessage extends MessageSchema {}
}
