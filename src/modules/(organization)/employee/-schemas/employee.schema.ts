import z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { WorkStatus } from '@/common/constants/enums'

const formSchema = toTypedSchema(
  z.object({
    user_id: z.string().min(1, 'Please select a user account'),
    full_name: z
      .string()
      .min(1, 'Full name is required')
      .max(100, 'Full name must be at most 100 characters'),
    status: z.nativeEnum(WorkStatus),
    email: z
      .string()
      .email('Invalid email address')
      .optional()
      .or(z.literal('')),
    join_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Join date must be YYYY-MM-DD'),
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
    remark: z
      .string()
      .max(500, 'Remark must be at most 500 characters')
      .optional()
      .or(z.literal('')),
  }),
)

export { formSchema }
