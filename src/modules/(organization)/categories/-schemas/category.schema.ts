import { RecordStatus } from '@/common/constants/enums'
import { z } from 'zod'

export const categoryFormSchema = z.object({
  id: z.number().optional(),
  isactive: z.nativeEnum(RecordStatus),
  code: z.string().min(1, 'Mã danh mục là bắt buộc').max(50),
  name: z.string().min(1, 'Tên danh mục là bắt buộc').max(150),
  slug: z.string().min(1, 'Slug là bắt buộc').max(180),
  sort_order: z.coerce.number().int().default(0),
  remark: z.string().max(500).optional().or(z.literal('')),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>
