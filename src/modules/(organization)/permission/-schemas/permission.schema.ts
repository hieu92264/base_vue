import { z } from 'zod'

export const permissionFormSchema = z.object({
  id: z.number().optional(),
  code: z.string().min(1, 'Mã quyền là bắt buộc'),
  name: z.string().min(1, 'Tên quyền là bắt buộc'),
  url: z.string().min(1, 'Đường dẫn là bắt buộc'),
  parent_id: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => {
      if (v === '' || v === undefined || v === null) return null
      const n = Number(v)
      return Number.isNaN(n) ? null : n
    }),
})

export type PermissionFormValues = z.infer<typeof permissionFormSchema>
