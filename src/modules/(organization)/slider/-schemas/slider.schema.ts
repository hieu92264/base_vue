import { z } from 'zod'

export const sliderFormSchema = z.object({
  id: z.number().optional(),
  title: z.string().nullable().optional(),
  link_url: z.string().nullable().optional(),
  sort_order: z.coerce.number().min(0, 'Thứ tự hiển thị phải lớn hơn hoặc bằng 0'),
  isactive: z.coerce.number().refine((v) => [0, 1].includes(v), {
    message: 'Trạng thái phải là 0 hoặc 1',
  }),
  remark: z.string().nullable().optional(),
  image: z.any().optional(),
})

export type SliderFormValues = z.infer<typeof sliderFormSchema>
