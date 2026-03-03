import { z } from 'zod'

export const permissionFormSchema = z.object({
  id: z.number().optional(),
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
  url: z.string().min(1, 'URL is required'),
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
