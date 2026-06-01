import { z } from 'zod'

export const roomFormSchema = z.object({
  isactive: z.enum(['Y', 'N']).default('Y'),
  category_id: z.coerce.number().nullable().optional(),
  post_type_id: z.coerce.number().nullable().optional(),
  city_id: z.coerce.number().nullable().optional(),
  district_id: z.coerce.number().nullable().optional(),
  ward_id: z.coerce.number().nullable().optional(),
  title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
  slug: z.string().optional(),
  address: z.string().nullable().optional(),
  price: z.coerce.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
  area: z.coerce.number().nullable().optional(),
  description: z.string().nullable().optional(),
  booking_status: z
    .enum(['pending', 'confirmed', 'available', 'occupied'])
    .default('pending'),
})

export type RoomFormValues = z.infer<typeof roomFormSchema>
