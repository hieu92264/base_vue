<script setup lang="ts">
import type { IUser } from '@/common/types/entities'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { computed, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { userFormSchema, type UserFormValues } from '../-schemas/user.schema'

const props = defineProps<{
  open: boolean
  isPending: boolean
  initialData?: IUser | null
  handleSubmit: (data: UserFormValues) => void
}>()

const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>()

const isEdit = computed(() => !!props.initialData?.id)

const form = useForm({
  validationSchema: toTypedSchema(userFormSchema),
  initialValues: {
    // user
    id: undefined,
    isactive: 'Y',
    username: '',
    email: undefined,
    password: '',
    locale: null,
    remark: null,

    // profile
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

const onOpenChange = (v: boolean) => {
  emit('update:open', v)
  if (!v) form.resetForm()
}

const onSubmit = form.handleSubmit((values) => {
  // Create: password required
  if (!isEdit.value && (!values.password || values.password.trim() === '')) {
    form.setFieldError('password', 'Password is required')
    return
  }

  // Edit: empty password -> do not update password
  if (isEdit.value && (!values.password || values.password.trim() === '')) {
    const { password, ...rest } = values
    props.handleSubmit(rest as any)
    return
  }

  props.handleSubmit(values)
})

watch(
  () => props.initialData,
  (u) => {
    if (!props.open) return

    if (!u) {
      form.resetForm()
      return
    }

    form.setValues({
      // user
      id: u.id,
      isactive: u.isactive ?? 'Y',
      username: u.username ?? '',
      email: u.email ?? null,
      password: '',
      locale: u.locale ?? null,
      remark: u.remark ?? null,

      // profile
      full_name: u.profile?.full_name ?? null,
      phone_number: u.profile?.phone_number ?? null,
      avatar_url: u.profile?.avatar_url ?? null,
      address: u.profile?.address ?? null,
      zalo: u.profile?.zalo ?? null,
      facebook: u.profile?.facebook ?? null,
      user_type: (u.profile?.user_type as any) ?? 'tenant',
      profile_remark: u.profile?.remark ?? null,
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
        <DialogTitle>{{ isEdit ? 'Edit User' : 'Add New User' }}</DialogTitle>
        <DialogDescription>
          Manage User + User Profile in one form.
        </DialogDescription>
      </DialogHeader>

      <form
        class="space-y-6"
        @submit.prevent="onSubmit"
      >
        <!-- USER -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            v-slot="{ componentField }"
            name="username"
          >
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl><Input v-bind="componentField" /></FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="email"
          >
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input v-bind="componentField" /></FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="password"
          >
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="password"
                  :placeholder="
                    isEdit ? '(Leave blank to keep current password)' : ''
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
              <FormLabel>Locale</FormLabel>
              <FormControl
                ><Input
                  v-bind="componentField"
                  placeholder="en / vi"
              /></FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="isactive"
          >
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Y">Active</SelectItem>
                    <SelectItem value="N">Inactive</SelectItem>
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
              <FormLabel>User Remark</FormLabel>
              <FormControl><Input v-bind="componentField" /></FormControl>
            </FormItem>
          </FormField>
        </div>

        <!-- PROFILE -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            v-slot="{ componentField }"
            name="full_name"
          >
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl><Input v-bind="componentField" /></FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="phone_number"
          >
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl><Input v-bind="componentField" /></FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="user_type"
          >
            <FormItem>
              <FormLabel>User type</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tenant">Tenant</SelectItem>
                    <SelectItem value="landlord">Landlord</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
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
              <FormLabel>Avatar URL</FormLabel>
              <FormControl
                ><Input
                  v-bind="componentField"
                  placeholder="https://..."
              /></FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="address"
          >
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl><Input v-bind="componentField" /></FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="zalo"
          >
            <FormItem>
              <FormLabel>Zalo</FormLabel>
              <FormControl><Input v-bind="componentField" /></FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="facebook"
          >
            <FormItem>
              <FormLabel>Facebook</FormLabel>
              <FormControl><Input v-bind="componentField" /></FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="profile_remark"
          >
            <FormItem>
              <FormLabel>Profile Remark</FormLabel>
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
            Cancel
          </Button>
          <Button
            type="submit"
            :disabled="isPending"
          >
            {{ isPending ? 'Saving...' : 'Submit' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
