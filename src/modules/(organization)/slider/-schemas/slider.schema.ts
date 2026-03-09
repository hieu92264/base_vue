import { z } from 'zod'

export const sliderFormSchema = z.object({
  id: z.number().optional(),
  title: z.string().nullable().optional(),
  link_url: z.string().nullable().optional(),
  sort_order: z.coerce.number().min(0, 'Sort order must be >= 0'),
  isactive: z.coerce.number().refine((v) => [0, 1].includes(v), {
    message: 'Status must be 0 or 1',
  }),
  remark: z.string().nullable().optional(),
  image: z.any().optional(),
})

export type SliderFormValues = z.infer<typeof sliderFormSchema>
