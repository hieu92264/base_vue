import { Language } from '@/common/constants/enums'
import { Json } from '@/common/utils/json.util'
import { AppConfigs } from '@/configs/app.config'

export class StorageService {
  static getLocale() {
    const locale = localStorage.getItem(AppConfigs.I18N_STORAGE_KEY)
    return Json.parse<Language>(locale) ?? Language.ENGLISH
  }
}
