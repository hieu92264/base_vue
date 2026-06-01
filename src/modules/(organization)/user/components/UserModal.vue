<script setup lang="ts">
import type { IUser } from '@/common/types/entities'
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
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { userFormSchema, type UserFormValues } from '../-schemas/user.schema'

const props = defineProps<{
  open: boolean
  isPending: boolean
  initialData?: IUser | null
  handleSubmit: (data: UserFormValues) => void
}>()

const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>()

const { t } = useI18n()
const isEdit = computed(() => !!props.initialData?.id)

const form = useForm({
  validationSchema: toTypedSchema(userFormSchema),
  initialValues: {
    id: undefined,
    isactive: 'Y',
    username: '',
    email: undefined,
    password: '',
    locale: null,
    remark: null,
    full_name: null,
    phone_number: null,
    avatar_url: null,
    address: null,
    zalo: null,
    facebook: null,
    user_type: 'tenant',
    profile_remark: null,
  },
})

const onOpenChange = (value: boolean) => {
  emit('update:open', value)
  if (!value) form.resetForm()
}

const onSubmit = form.handleSubmit((values) => {
  if (!isEdit.value && (!values.password || values.password.trim() === '')) {
    form.setFieldError('password', t('pages.organizationUsers.passwordRequired'))
    return
  }

  if (isEdit.value && (!values.password || values.password.trim() === '')) {
    const { password, ...rest } = values
    props.handleSubmit(rest as any)
    return
  }

  props.handleSubmit(values)
})

watch(
  () => props.initialData,
  (user) => {
    if (!props.open) return

    if (!user) {
      form.resetForm()
      return
    }

    form.setValues({
      id: user.id,
      isactive: user.isactive ?? 'Y',
      username: user.username ?? '',
      email: user.email ?? null,
      password: '',
      locale: user.locale ?? null,
      remark: user.remark ?? null,
      full_name: user.profile?.full_name ?? null,
      phone_number: user.profile?.phone_number ?? null,
      avatar_url: user.profile?.avatar_url ?? null,
      address: user.profile?.address ?? null,
      zalo: user.profile?.zalo ?? null,
      facebook: user.profile?.facebook ?? null,
      user_type: (user.profile?.user_type as any) ?? 'tenant',
      profile_remark: user.profile?.remark ?? null,
    } as any)
  },
  { immediate: true },
)
</script>

<template>
  <Dialog
    :open="open"
    @update:open="onOpenChange"
  >
    <DialogContent class="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {{
            isEdit
              ? t('pages.organizationUsers.editUser')
              : t('pages.organizationUsers.createUser')
          }}
        </DialogTitle>
        <DialogDescription>
          {{ t('pages.organizationUsers.modalDescription') }}
        </DialogDescription>
      </DialogHeader>

      <form
        class="space-y-6"
        @submit.prevent="onSubmit"
      >
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            v-slot="{ componentField }"
            name="username"
          >
            <FormItem>
              <FormLabel>{{ t('pages.organizationUsers.username') }}</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  :placeholder="t('pages.organizationUsers.usernamePlaceholder')"
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="email"
          >
            <FormItem>
              <FormLabel>{{ t('pages.organizationUsers.email') }}</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  :placeholder="t('pages.organizationUsers.emailPlaceholder')"
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="password"
          >
            <FormItem>
              <FormLabel>{{ t('pages.organizationUsers.password') }}</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="password"
                  :placeholder="
                    isEdit
                      ? t('pages.organizationUsers.passwordPlaceholderEdit')
                      : ''
                  "
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="locale"
          >
            <FormItem>
              <FormLabel>{{ t('pages.organizationUsers.locale') }}</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  :placeholder="t('pages.organizationUsers.localePlaceholder')"
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="isactive"
          >
            <FormItem>
              <FormLabel>{{ t('pages.organizationUsers.status') }}</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue
                      :placeholder="t('pages.organizationUsers.selectStatus')"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Y">{{ t('common.active') }}</SelectItem>
                    <SelectItem value="N">{{ t('common.inactive') }}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="remark"
          >
            <FormItem>
              <FormLabel>{{ t('pages.organizationUsers.userRemark') }}</FormLabel>
              <FormControl><Input v-bind="componentField" /></FormControl>
            </FormItem>
          </FormField>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            v-slot="{ componentField }"
            name="full_name"
          >
            <FormItem>
              <FormLabel>{{ t('pages.organizationUsers.fullName') }}</FormLabel>
              <FormControl><Input v-bind="componentField" /></FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="phone_number"
          >
            <FormItem>
              <FormLabel>{{ t('pages.organizationUsers.phoneNumber') }}</FormLabel>
              <FormControl><Input v-bind="componentField" /></FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="user_type"
          >
            <FormItem>
              <FormLabel>{{ t('pages.organizationUsers.userType') }}</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue
                      :placeholder="t('pages.organizationUsers.selectUserType')"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tenant">
                      {{ t('status.userType.tenant') }}
                    </SelectItem>
                    <SelectItem value="landlord">
                      {{ t('status.userType.landlord') }}
                    </SelectItem>
                    <SelectItem value="admin">
                      {{ t('status.userType.admin') }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="avatar_url"
          >
            <FormItem>
              <FormLabel>{{ t('pages.organizationUsers.avatarUrl') }}</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  :placeholder="t('pages.organizationUsers.avatarUrlPlaceholder')"
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="address"
          >
            <FormItem>
              <FormLabel>{{ t('pages.organizationUsers.address') }}</FormLabel>
              <FormControl><Input v-bind="componentField" /></FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="zalo"
          >
            <FormItem>
              <FormLabel>{{ t('pages.organizationUsers.zalo') }}</FormLabel>
              <FormControl><Input v-bind="componentField" /></FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="facebook"
          >
            <FormItem>
              <FormLabel>{{ t('pages.organizationUsers.facebook') }}</FormLabel>
              <FormControl><Input v-bind="componentField" /></FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="profile_remark"
          >
            <FormItem>
              <FormLabel>
                {{ t('pages.organizationUsers.profileRemark') }}
              </FormLabel>
              <FormControl><Input v-bind="componentField" /></FormControl>
            </FormItem>
          </FormField>
        </div>

        <DialogFooter class="mt-4!">
          <Button
            type="button"
            variant="outline"
            @click="emit('update:open', false)"
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
