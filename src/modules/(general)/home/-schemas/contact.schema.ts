import z from 'zod'

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Vui lòng nhập họ tên.')
    .max(100, 'Tối đa 100 ký tự.'),
  phone: z
    .string()
    .min(1, 'Vui lòng nhập số điện thoại.')
    .max(20, 'Tối đa 20 ký tự.'),
  email: z.string().email('Email không hợp lệ.').optional().or(z.literal('')),
  moveInDate: z.string().min(1, 'Vui lòng chọn ngày dự kiến dọn vào.'),
  message: z
    .string()
    .max(1000, 'Tối đa 1000 ký tự.')
    .optional()
    .or(z.literal('')),
})

export type ContactFormValues = z.infer<typeof contactSchema>
