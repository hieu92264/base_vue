import i18n from '@/configs/i18n.config'
import { z } from 'zod'

const t = (key: string) => (i18n.global as any).t(key) as string

export const permissionFormSchema = z.object({
  id: z.number().optional(),
  code: z
    .string()
    .min(1, t('pages.organizationPermissions.validation.codeRequired')),
  name: z
    .string()
    .min(1, t('pages.organizationPermissions.validation.nameRequired')),
  url: z
    .string()
    .min(1, t('pages.organizationPermissions.validation.urlRequired')),
  parent_id: z
    .union([z.string(), z.number()])
    .optional()
    .transform((value) => {
      if (value === '' || value === undefined || value === null) return null
      const numberValue = Number(value)
      return Number.isNaN(numberValue) ? null : numberValue
    }),
})

export type PermissionFormValues = z.infer<typeof permissionFormSchema>
