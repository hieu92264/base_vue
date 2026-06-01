import i18n from '@/configs/i18n.config'
import { z } from 'zod'

const t = (key: string) => (i18n.global as any).t(key) as string

export const categoryFormSchema = z.object({
  id: z.number().optional(),
  isactive: z.enum(['Y', 'N']).optional(),
  code: z
    .string()
    .min(1, t('pages.organizationCategories.validation.codeRequired'))
    .max(50),
  name: z
    .string()
    .min(1, t('pages.organizationCategories.validation.nameRequired'))
    .max(150),
  slug: z
    .string()
    .min(1, t('pages.organizationCategories.validation.slugRequired'))
    .max(180),
  sort_order: z.coerce.number().optional(),
  remark: z.string().optional(),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>
