import { isEmpty } from 'lodash-es'
import z from 'zod'

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Địa chỉ email không hợp lệ' }),
})

export type ForgotPasswordFormValue = z.infer<typeof forgotPasswordSchema>
