import z from 'zod'
import { isEmpty } from 'lodash-es'

export const resetPasswordSchema = z
  .object({
    token: z.string().refine((v) => !isEmpty(v), { message: '' }),
    email: z.string().email({ message: '' }),
    password: z.string().refine((v) => !isEmpty(v), { message: '' }),
    password_confirmation: z
      .string()
      .refine((v) => !isEmpty(v), { message: '' }),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: '',
    path: ['password_confirmation'],
  })

export type ResetPasswordFormValue = z.infer<typeof resetPasswordSchema>
