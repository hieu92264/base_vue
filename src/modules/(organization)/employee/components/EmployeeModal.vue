<script setup lang="ts">
import { WorkStatus } from '@/common/constants/enums'
import type { IEmployee } from '@/common/types/entities'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  employeeFormSchema,
  type EmployeeFormValues,
} from '@/modules/(organization)/employee/-schemas/employee.schema'

const props = defineProps<{
  open: boolean
  isPending: boolean
  initialData?: IEmployee | null
  userOptions?: Array<{ text: string; value: number; selected?: boolean }>
  handleSubmit: (data: EmployeeFormValues) => void
}>()

const emit = defineEmits(['update:open', 'submit'])

const { t } = useI18n()
const userSearch = ref('')

const filteredUserOptions = computed(() => {
  const q = userSearch.value.trim().toLowerCase()
  if (!q) return props.userOptions ?? []

  return (props.userOptions ?? []).filter((option) =>
    option.text.toLowerCase().includes(q),
  )
})

const form = useForm({
  validationSchema: toTypedSchema(employeeFormSchema),
  initialValues: {
    id: undefined,
    user_id: undefined,
    full_name: '',
    status: WorkStatus.OFFICIAL,
    email: '',
    join_date: '',
    dob: '',
    phone: '',
    terminate_date: '',
    remark: '',
  },
})

const workStatusOptions = computed(() =>
  Object.values(WorkStatus).map((value) => ({
    text: t(`status.work.${value}`),
    value,
  })),
)

const toDateInputValue = (value?: string | null) => {
  if (!value) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const onSubmit = form.handleSubmit((values) => {
  props.handleSubmit(values)
})

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.setValues({
        id: newData.id,
        user_id: newData.user_id ? String(newData.user_id) : undefined,
        full_name: newData.full_name ?? '',
        status: newData.status ?? WorkStatus.OFFICIAL,
        email: newData.email ?? '',
        join_date: toDateInputValue(newData.join_date) ?? '',
        dob: toDateInputValue(newData.dob) ?? '',
        phone: newData.phone ?? '',
        terminate_date: toDateInputValue(newData.terminate_date) ?? '',
        remark: newData.remark ?? '',
      })
    } else {
      form.resetForm()
    }
  },
  { immediate: true },
)
</script>

<template>
  <Dialog
    :open="open"
    @update:open="$emit('update:open', $event)"
  >
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {{
            initialData
              ? t('pages.organizationEmployees.editEmployee')
              : t('pages.organizationEmployees.createEmployee')
          }}
        </DialogTitle>

        <DialogDescription>
          {{ t('pages.organizationEmployees.modalDescription') }}
        </DialogDescription>
      </DialogHeader>

      <form
        class="space-y-6"
        @submit.prevent="onSubmit"
      >
        <div class="grid gap-4">
          <FormField
            v-slot="{ componentField }"
            name="user_id"
          >
            <FormItem>
              <FormLabel>
                {{ t('pages.organizationEmployees.userAccount') }}
              </FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue
                      :placeholder="t('pages.organizationEmployees.selectUser')"
                    />
                  </SelectTrigger>

                  <SelectContent class="max-h-60 overflow-y-auto">
                    <div class="sticky top-0 z-10 bg-background p-2">
                      <Input
                        v-model="userSearch"
                        :placeholder="t('pages.organizationEmployees.searchUser')"
                        @keydown.stop
                      />
                    </div>

                    <SelectItem
                      v-for="option in filteredUserOptions"
                      :key="option.value"
                      :value="option.value.toString()"
                    >
                      {{ option.text }}
                    </SelectItem>

                    <div
                      v-if="filteredUserOptions.length === 0"
                      class="px-3 py-2 text-sm text-muted-foreground"
                    >
                      {{ t('pages.organizationEmployees.noUserResult') }}
                    </div>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          </FormField>

          <div class="grid grid-cols-2 gap-4">
            <FormField
              v-slot="{ componentField }"
              name="full_name"
            >
              <FormItem>
                <FormLabel>{{ t('pages.organizationEmployees.fullName') }}</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    type="text"
                    :placeholder="
                      t('pages.organizationEmployees.fullNamePlaceholder')
                    "
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="status"
            >
              <FormItem>
                <FormLabel>
                  {{ t('pages.organizationEmployees.workStatus') }}
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full">
                      <SelectValue
                        :placeholder="
                          t('pages.organizationEmployees.selectWorkStatus')
                        "
                      />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem
                        v-for="option in workStatusOptions"
                        :key="option.value"
                        :value="option.value.toString()"
                      >
                        {{ option.text }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            </FormField>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <FormField
              v-slot="{ componentField }"
              name="email"
            >
              <FormItem>
                <FormLabel>{{ t('pages.organizationEmployees.email') }}</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    type="email"
                    :placeholder="t('pages.organizationEmployees.emailPlaceholder')"
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormField
              v-slot="{ componentField }"
              name="join_date"
            >
              <FormItem>
                <FormLabel>{{ t('pages.organizationEmployees.joinDate') }}</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    type="date"
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="dob"
            >
              <FormItem>
                <FormLabel>{{ t('pages.organizationEmployees.dob') }}</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    type="date"
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormField
              v-slot="{ componentField }"
              name="phone"
            >
              <FormItem>
                <FormLabel>{{ t('pages.organizationEmployees.phone') }}</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    :placeholder="t('pages.organizationEmployees.phonePlaceholder')"
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="terminate_date"
            >
              <FormItem>
                <FormLabel>
                  {{ t('pages.organizationEmployees.terminateDate') }}
                </FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    type="date"
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <FormField
              v-slot="{ componentField }"
              name="remark"
            >
              <FormItem>
                <FormLabel>{{ t('pages.organizationEmployees.remark') }}</FormLabel>
                <FormControl>
                  <Textarea
                    v-bind="componentField"
                    :placeholder="t('pages.organizationEmployees.remarkPlaceholder')"
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>
        </div>

        <DialogFooter class="mt-4!">
          <Button
            type="button"
            variant="outline"
            @click="$emit('update:open', false)"
          >
            {{ t('common.cancel') }}
          </Button>
          <Button
            type="submit"
            :disabled="isPending"
          >
            {{ isPending ? t('common.savePending') : t('common.save') }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
