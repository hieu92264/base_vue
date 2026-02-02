import { isEmpty } from 'lodash-es'
import z from 'zod'

export const loginSchema = z.object({
  username: z.string().refine((value) => !isEmpty(value), { message: '' }),
  password: z.string().refine((value) => !isEmpty(value), { message: '' }),
})

export type LoginFormValue = z.infer<typeof loginSchema>
