<script setup lang="ts">
import { RecordStatus } from '@/common/constants/enums'
import type { ICategory } from '@/common/types/entities'
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
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  categoryFormSchema,
  type CategoryFormValues,
} from '../-schemas/category.schema'

const props = defineProps<{
  open: boolean
  isPending: boolean
  initialData?: ICategory | null
  handleSubmit: (data: CategoryFormValues) => void
}>()

defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const { t } = useI18n()

const form = useForm({
  validationSchema: toTypedSchema(categoryFormSchema),
  initialValues: {
    id: undefined,
    isactive: RecordStatus.ACTIVE,
    code: '',
    name: '',
    slug: '',
    sort_order: 0,
    remark: '',
  },
})

const onSubmit = form.handleSubmit((values) => {
  props.handleSubmit(values)
})

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.setValues({
        id: newData.id,
        isactive: newData.isactive ?? RecordStatus.ACTIVE,
        code: newData.code ?? '',
        name: newData.name ?? '',
        slug: newData.slug ?? '',
        sort_order: Number(newData.sort_order ?? 0),
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
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>
          {{
            initialData
              ? t('pages.organizationCategories.editCategory')
              : t('pages.organizationCategories.createCategory')
          }}
        </DialogTitle>
        <DialogDescription>
          {{ t('pages.organizationCategories.modalDescription') }}
        </DialogDescription>
      </DialogHeader>

      <form
        class="space-y-6"
        @submit.prevent="onSubmit"
      >
        <div class="grid gap-4">
          <div class="grid grid-cols-2 gap-4">
            <FormField
              v-slot="{ componentField }"
              name="code"
            >
              <FormItem>
                <FormLabel>{{ t('pages.organizationCategories.code') }}</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    :placeholder="t('pages.organizationCategories.codePlaceholder')"
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="isactive"
            >
              <FormItem>
                <FormLabel>{{ t('pages.organizationCategories.status') }}</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full">
                      <SelectValue :placeholder="t('pages.organizationCategories.selectStatus')" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem :value="RecordStatus.ACTIVE">
                        {{ t('pages.organizationCategories.active') }}
                      </SelectItem>
                      <SelectItem :value="RecordStatus.INACTIVE">
                        {{ t('pages.organizationCategories.inactive') }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            </FormField>
          </div>

          <FormField
            v-slot="{ componentField }"
            name="name"
          >
            <FormItem>
              <FormLabel>{{ t('pages.organizationCategories.name') }}</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  :placeholder="t('pages.organizationCategories.namePlaceholder')"
                />
              </FormControl>
            </FormItem>
          </FormField>

          <div class="grid grid-cols-2 gap-4">
            <FormField
              v-slot="{ componentField }"
              name="slug"
            >
              <FormItem>
                <FormLabel>{{ t('pages.organizationCategories.slug') }}</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    :placeholder="t('pages.organizationCategories.slugPlaceholder')"
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="sort_order"
            >
              <FormItem>
                <FormLabel>{{ t('pages.organizationCategories.sortOrder') }}</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    type="number"
                    placeholder="0"
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>

          <FormField
            v-slot="{ componentField }"
            name="remark"
          >
            <FormItem>
              <FormLabel>{{ t('pages.organizationCategories.remark') }}</FormLabel>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  :placeholder="t('pages.organizationCategories.remarkPlaceholder')"
                  rows="4"
                />
              </FormControl>
            </FormItem>
          </FormField>
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
            {{
              isPending
                ? t('pages.organizationCategories.savePending')
                : t('common.save')
            }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
