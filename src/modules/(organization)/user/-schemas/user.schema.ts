import i18n from '@/configs/i18n.config'
import { z } from 'zod'

const t = (key: string) => (i18n.global as any).t(key) as string

export const userFormSchema = z
  .object({
    id: z.number().optional(),
    isactive: z.enum(['Y', 'N']).optional(),
    username: z
      .string()
      .min(1, t('pages.organizationUsers.validation.usernameRequired')),
    email: z
      .string()
      .email(t('pages.organizationUsers.validation.emailInvalid'))
      .optional()
      .or(z.literal(''))
      .transform((value) => (value === '' ? null : value)),
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
  .superRefine((value, ctx) => {
    if (!value.id && (!value.password || value.password.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: t('pages.organizationUsers.validation.passwordRequired'),
      })
    }
  })

export type UserFormValues = z.infer<typeof userFormSchema>
