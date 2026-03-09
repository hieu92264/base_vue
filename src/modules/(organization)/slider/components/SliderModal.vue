<script setup lang="ts">
import type { ISlider } from '@/common/types/entities'
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
import { Textarea } from '@/components/ui/textarea'
import { computed, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

const onOpenChange = (v: boolean) => {
  emit('update:open', v)

  if (!v) {
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

const handleFileChange = (e: Event, handleChange: (value: any) => void) => {
  const target = e.target as HTMLInputElement
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
          {{ initialData ? 'Edit Slider' : 'Add New Slider' }}
        </DialogTitle>
        <DialogDescription>
          Fill in slider information, then click Submit to save.
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
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="Slider title"
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
              <FormLabel>Sort Order</FormLabel>
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
              <FormLabel>Link URL</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="https://example.com"
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
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem :value="1">Active</SelectItem>
                    <SelectItem :value="0">Inactive</SelectItem>
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
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.avif"
                  @change="(e: Event) => handleFileChange(e, handleChange)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div
            v-if="currentPreview"
            class="md:col-span-2"
          >
            <p class="mb-2 text-sm font-medium">Preview</p>
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
              <FormLabel>Remark</FormLabel>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  placeholder="Remark..."
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
