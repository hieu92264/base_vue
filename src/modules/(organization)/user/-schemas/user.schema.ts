import { z } from 'zod'

export const userFormSchema = z
  .object({
    id: z.number().optional(),

    isactive: z.enum(['Y', 'N']).optional(), // chặt hơn (optional)
    username: z.string().min(1, 'Tên đăng nhập là bắt buộc'),
    email: z
      .string()
      .email('Email không hợp lệ')
      .optional()
      .or(z.literal(''))
      .transform((v) => (v === '' ? null : v)),
    password: z.string().optional(),

    locale: z.string().optional().nullable(),
    remark: z.string().optional().nullable(),

    full_name: z.string().optional().nullable(),
    phone_number: z.string().optional().nullable(),
    avatar_url: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    zalo: z.string().optional().nullable(),
    facebook: z.string().optional().nullable(),
    user_type: z.enum(['admin', 'tenant', 'landlord']),
    profile_remark: z.string().optional().nullable(),
  })
  .superRefine((val, ctx) => {
    if (!val.id && (!val.password || val.password.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: 'Mật khẩu là bắt buộc',
      })
    }
  })

export type UserFormValues = z.infer<typeof userFormSchema>
