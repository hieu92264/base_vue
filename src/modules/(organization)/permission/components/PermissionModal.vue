<script setup lang="ts">
import type { IPermission } from '@/common/types/entities'
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
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  permissionFormSchema,
  type PermissionFormValues,
} from '../-schemas/permission.schema'

const NONE_VALUE = '__none__'

const props = defineProps<{
  open: boolean
  isPending: boolean
  initialData?: IPermission | null
  permissionOptions?: Array<{ text: string; value: number; selected?: boolean }>
  handleSubmit: (data: PermissionFormValues) => void
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const { t } = useI18n()
const optionSearch = ref('')

const filteredOptions = computed(() => {
  const q = optionSearch.value.trim().toLowerCase()
  if (!q) return props.permissionOptions ?? []
  return (props.permissionOptions ?? []).filter((option) =>
    option.text.toLowerCase().includes(q),
  )
})

const form = useForm({
  validationSchema: toTypedSchema(permissionFormSchema),
  initialValues: {
    id: undefined,
    code: '',
    name: '',
    url: '',
    parent_id: NONE_VALUE,
  },
})

const closeModal = () => {
  emit('update:open', false)
}

const onOpenChange = (value: boolean) => {
  emit('update:open', value)
  if (!value) {
    optionSearch.value = ''
    form.resetForm({
      values: {
        id: undefined,
        code: '',
        name: '',
        url: '',
        parent_id: NONE_VALUE,
      },
    })
  }
}

const onSubmit = form.handleSubmit((values) => {
  const payload: PermissionFormValues = {
    ...values,
    parent_id:
      (values as any).parent_id === NONE_VALUE ? null : values.parent_id,
  }

  if (
    props.initialData?.id &&
    payload.parent_id != null &&
    Number(payload.parent_id) === Number(props.initialData.id)
  ) {
    form.setFieldError(
      'parent_id',
      t('pages.organizationPermissions.parentSelfError'),
    )
    return
  }

  props.handleSubmit(payload)
})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) optionSearch.value = ''
  },
)

watch(
  () => props.initialData,
  (newData) => {
    if (!props.open) return

    if (newData) {
      form.setValues({
        id: newData.id,
        code: newData.code ?? '',
        name: newData.name ?? '',
        url: newData.url ?? '',
        parent_id:
          newData.parent_id == null ? NONE_VALUE : String(newData.parent_id),
      } as any)
    } else {
      form.resetForm({
        values: {
          id: undefined,
          code: '',
          name: '',
          url: '',
          parent_id: NONE_VALUE,
        },
      })
    }
  },
  { immediate: true },
)
</script>

<template>
  <Dialog
    :open="open"
    @update:open="onOpenChange"
  >
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {{
            initialData
              ? t('pages.organizationPermissions.editPermission')
              : t('pages.organizationPermissions.createPermission')
          }}
        </DialogTitle>
        <DialogDescription>
          {{ t('pages.organizationPermissions.modalDescription') }}
        </DialogDescription>
      </DialogHeader>

      <form
        class="space-y-6"
        @submit.prevent="onSubmit"
      >
        <div class="grid gap-4">
          <FormField
            v-slot="{ componentField }"
            name="code"
          >
            <FormItem>
              <FormLabel>{{ t('pages.organizationPermissions.code') }}</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  :placeholder="t('pages.organizationPermissions.codePlaceholder')"
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="name"
          >
            <FormItem>
              <FormLabel>{{ t('pages.organizationPermissions.name') }}</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  :placeholder="t('pages.organizationPermissions.namePlaceholder')"
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="url"
          >
            <FormItem>
              <FormLabel>{{ t('pages.organizationPermissions.url') }}</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  :placeholder="t('pages.organizationPermissions.urlPlaceholder')"
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="parent_id"
          >
            <FormItem>
              <FormLabel>
                {{ t('pages.organizationPermissions.parentPermission') }}
              </FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue
                      :placeholder="
                        t('pages.organizationPermissions.selectParentPermission')
                      "
                    />
                  </SelectTrigger>

                  <SelectContent class="max-h-60 overflow-y-auto">
                    <div class="sticky top-0 z-10 bg-background p-2">
                      <Input
                        v-model="optionSearch"
                        :placeholder="t('pages.organizationPermissions.searchPermission')"
                        @keydown.stop
                      />
                    </div>

                    <SelectItem :value="NONE_VALUE">
                      {{ t('pages.organizationPermissions.noParent') }}
                    </SelectItem>

                    <SelectItem
                      v-for="option in filteredOptions"
                      :key="option.value"
                      :value="String(option.value)"
                    >
                      {{ option.text }}
                    </SelectItem>

                    <div
                      v-if="filteredOptions.length === 0"
                      class="px-3 py-2 text-sm text-muted-foreground"
                    >
                      {{ t('common.noResults') }}
                    </div>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          </FormField>
        </div>

        <DialogFooter class="mt-4!">
          <Button
            type="button"
            variant="outline"
            @click="closeModal"
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
