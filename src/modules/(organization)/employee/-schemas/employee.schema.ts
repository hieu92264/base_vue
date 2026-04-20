import { WorkStatus } from '@/common/constants/enums'
import i18n from '@/configs/i18n.config'
import { z } from 'zod'

const t = (key: string) => (i18n.global as any).t(key) as string

export const employeeFormSchema = z.object({
  id: z.number().optional(),
  user_id: z
    .string()
    .min(1, t('pages.organizationEmployees.validation.userRequired')),
  full_name: z
    .string()
    .min(1, t('pages.organizationEmployees.validation.fullNameRequired'))
    .max(100),
  status: z.nativeEnum(WorkStatus),
  email: z.string().email().optional().or(z.literal('')),
  join_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: t('pages.organizationEmployees.validation.joinDateInvalid'),
  }),
  dob: z
    .string()
    .nullable()
    .or(z.literal(''))
    .refine((value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value || ''), {
      message: t('pages.organizationEmployees.validation.dobInvalid'),
    }),
  phone: z.string().optional().or(z.literal('')),
  terminate_date: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value ?? ''), {
      message: t('pages.organizationEmployees.validation.terminateDateInvalid'),
    }),
  remark: z.string().max(500).optional().or(z.literal('')),
})

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>
