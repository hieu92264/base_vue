import { isPrimitive } from '@/common/utils/common.util'
import { isNil } from 'lodash-es'

export class Json {
  public static isValid(value: string | null) {
    try {
      if (isNil(value)) return false

      return !!JSON.parse(value)
    } catch {
      return false
    }
  }

  /**
   * @description Safely parse value to JSON
   * @param value
   * @returns
   */
  public static parse<T>(value: any): T {
    if (!Json.isValid(value)) return value
    return JSON.parse(value) as T
  }

  public static stringtify(value: any) {
    return isPrimitive(value) ? value : JSON.stringify(value)
  }
}
