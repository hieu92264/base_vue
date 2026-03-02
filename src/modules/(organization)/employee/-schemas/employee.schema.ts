import { z } from 'zod'
import { WorkStatus } from '@/common/constants/enums'

export const employeeFormSchema = z.object({
  id: z.number().optional(),
  user_id: z.string().min(1, 'Please select a user account'),
  full_name: z.string().min(1).max(100),
  status: z.nativeEnum(WorkStatus),
  email: z.string().email().optional().or(z.literal('')),
  join_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dob: z
    .string()
    .nullable()
    .or(z.literal(''))
    .refine((v) => v === '' || /^\d{4}-\d{2}-\d{2}$/.test(v || ''), {
      message: 'DOB must be YYYY-MM-DD',
    }),
  phone: z.string().optional().or(z.literal('')),
  terminate_date: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((v) => v === '' || /^\d{4}-\d{2}-\d{2}$/.test(v ?? ''), {
      message: 'Terminate date must be YYYY-MM-DD',
    }),
  remark: z.string().max(500).optional().or(z.literal('')),
})

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>
