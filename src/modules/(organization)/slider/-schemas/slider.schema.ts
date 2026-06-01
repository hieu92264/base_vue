import i18n from '@/configs/i18n.config'
import { z } from 'zod'

const t = (key: string) => (i18n.global as any).t(key) as string

export const sliderFormSchema = z.object({
  id: z.number().optional(),
  title: z.string().nullable().optional(),
  link_url: z.string().nullable().optional(),
  sort_order: z.coerce
    .number()
    .min(0, t('pages.organizationSliders.validation.sortOrderInvalid')),
  isactive: z.coerce.number().refine((value) => [0, 1].includes(value), {
    message: t('pages.organizationSliders.validation.statusInvalid'),
  }),
  remark: z.string().nullable().optional(),
  image: z.any().optional(),
})

export type SliderFormValues = z.infer<typeof sliderFormSchema>
