import { isEmpty } from 'lodash-es'
import z from 'zod'

export const registerSchema = z
  .object({
    username: z.string().refine((value) => !isEmpty(value), { message: '' }),
    email: z.string().email({ message: '' }),
    password: z.string().refine((value) => !isEmpty(value), { message: '' }),
    verify_password: z
      .string()
      .refine((value) => !isEmpty(value), { message: '' }),

    user_type: z.enum(['tenant', 'landlord']).default('tenant'),
  })
  .refine((data) => data.password === data.verify_password, {
    message: '',
    path: ['verify_password'],
  })

export type RegisterFormValue = z.infer<typeof registerSchema>
