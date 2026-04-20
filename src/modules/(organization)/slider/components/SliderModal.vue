<script setup lang="ts">
import type { ISlider } from '@/common/types/entities'
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
  FormMessage,
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
  sliderFormSchema,
  type SliderFormValues,
} from '../-schemas/slider.schema'

const props = defineProps<{
  open: boolean
  isPending: boolean
  initialData?: ISlider | null
  handleSubmit: (data: SliderFormValues) => void
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const { t } = useI18n()
const imagePreview = ref<string>('')

const form = useForm({
  validationSchema: toTypedSchema(sliderFormSchema),
  initialValues: {
    id: undefined,
    title: '',
    link_url: '',
    sort_order: 0,
    isactive: 1,
    remark: '',
    image: undefined,
  },
})

const currentPreview = computed(() => {
  if (imagePreview.value) return imagePreview.value
  if (props.initialData?.image_url) return props.initialData.image_url
  return ''
})

const onOpenChange = (value: boolean) => {
  emit('update:open', value)

  if (!value) {
    imagePreview.value = ''
    form.resetForm({
      values: {
        id: undefined,
        title: '',
        link_url: '',
        sort_order: 0,
        isactive: 1,
        remark: '',
        image: undefined,
      },
    })
  }
}

const handleFileChange = (event: Event, handleChange: (value: any) => void) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  handleChange(file)

  if (file) {
    imagePreview.value = URL.createObjectURL(file)
  } else {
    imagePreview.value = ''
  }
}

const onSubmit = form.handleSubmit((values) => {
  props.handleSubmit(values)
})

watch(
  () => props.initialData,
  (newData) => {
    if (!props.open) return

    if (newData) {
      form.setValues({
        id: newData.id,
        title: newData.title ?? '',
        link_url: newData.link_url ?? '',
        sort_order: newData.sort_order ?? 0,
        isactive: Number(newData.isactive ?? 1),
        remark: newData.remark ?? '',
        image: undefined,
      })
      imagePreview.value = ''
    } else {
      form.resetForm({
        values: {
          id: undefined,
          title: '',
          link_url: '',
          sort_order: 0,
          isactive: 1,
          remark: '',
          image: undefined,
        },
      })
      imagePreview.value = ''
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
    <DialogContent class="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {{
            initialData
              ? t('pages.organizationSliders.editSlider')
              : t('pages.organizationSliders.createSlider')
          }}
        </DialogTitle>
        <DialogDescription>
          {{ t('pages.organizationSliders.modalDescription') }}
        </DialogDescription>
      </DialogHeader>

      <form
        class="space-y-6"
        @submit.prevent="onSubmit"
      >
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            v-slot="{ componentField }"
            name="title"
          >
            <FormItem>
              <FormLabel>{{ t('pages.organizationSliders.title') }}</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  :placeholder="t('pages.organizationSliders.titlePlaceholder')"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="sort_order"
          >
            <FormItem>
              <FormLabel>{{ t('pages.organizationSliders.sortOrder') }}</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="number"
                  placeholder="0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="link_url"
          >
            <FormItem class="md:col-span-2">
              <FormLabel>{{ t('pages.organizationSliders.linkUrl') }}</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  :placeholder="t('pages.organizationSliders.linkPlaceholder')"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="isactive"
          >
            <FormItem>
              <FormLabel>{{ t('pages.organizationSliders.status') }}</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue
                      :placeholder="t('pages.organizationSliders.selectStatus')"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem :value="1">{{ t('common.active') }}</SelectItem>
                    <SelectItem :value="0">{{ t('common.inactive') }}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ handleChange }"
            name="image"
          >
            <FormItem>
              <FormLabel>{{ t('pages.organizationSliders.image') }}</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.avif"
                  @change="(event: Event) => handleFileChange(event, handleChange)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div
            v-if="currentPreview"
            class="md:col-span-2"
          >
            <p class="mb-2 text-sm font-medium">
              {{ t('pages.organizationSliders.preview') }}
            </p>
            <img
              :src="currentPreview"
              class="h-40 w-full rounded-md border object-cover"
            />
          </div>

          <FormField
            v-slot="{ componentField }"
            name="remark"
          >
            <FormItem class="md:col-span-2">
              <FormLabel>{{ t('pages.organizationSliders.remark') }}</FormLabel>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  :placeholder="t('pages.organizationSliders.remarkPlaceholder')"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <DialogFooter>
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
