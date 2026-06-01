<script setup lang="ts">
import type { IPermission } from '@/common/types/entities'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

type TreeNode = IPermission & { children?: TreeNode[] }

const props = defineProps<{
  node: TreeNode
  selected: Set<number>
  expanded: Set<number>
  onToggle: (node: TreeNode, checked: boolean) => void
  onToggleExpand: (id: number) => void
  collectIds: (node: TreeNode) => number[]
}>()

const { t } = useI18n()
const checkboxRef = ref<HTMLInputElement | null>(null)

const hasChildren = computed(() => (props.node.children?.length ?? 0) > 0)

const allChildIds = computed(() => {
  if (!hasChildren.value) return []
  return props.node.children!.flatMap((child) => props.collectIds(child))
})

const isChecked = computed(() => {
  if (!hasChildren.value) return props.selected.has(props.node.id)
  const ids = allChildIds.value
  return (
    ids.length > 0 &&
    ids.every(
      (id) => props.selected.has(id) && props.selected.has(props.node.id),
    )
  )
})

const isIndeterminate = computed(() => {
  if (!hasChildren.value) return false
  const ids = allChildIds.value
  if (ids.length === 0) return false
  const count = ids.filter((id) => props.selected.has(id)).length
  return count > 0 && count < ids.length
})

const isExpanded = computed(() => props.expanded.has(props.node.id))

watch(
  isIndeterminate,
  (value) => {
    if (checkboxRef.value) checkboxRef.value.indeterminate = value
  },
  {
    immediate: true,
  },
)

onMounted(() => {
  if (checkboxRef.value) checkboxRef.value.indeterminate = isIndeterminate.value
})

const toggle = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  props.onToggle(props.node, checked)
}
</script>

<template>
  <div class="select-none">
    <div class="flex items-center gap-2 py-1">
      <button
        v-if="hasChildren"
        type="button"
        class="flex h-6 w-6 items-center justify-center rounded hover:bg-muted"
        :aria-label="isExpanded ? t('common.collapse') : t('common.expand')"
        @click="onToggleExpand(node.id)"
      >
        <span class="text-sm">{{ isExpanded ? '▾' : '▸' }}</span>
      </button>
      <span
        v-else
        class="w-6"
      />

      <input
        ref="checkboxRef"
        type="checkbox"
        class="h-4 w-4"
        :checked="isChecked"
        @change="toggle"
      />

      <div class="flex flex-col">
        <span class="text-sm font-medium">{{ node.name }}</span>
        <span class="text-xs text-muted-foreground">{{ node.code }}</span>
      </div>
    </div>
    <div
      v-if="hasChildren && isExpanded"
      class="ml-3 border-l border-muted pl-6"
    >
      <PermissionTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :selected="selected"
        :expanded="expanded"
        :on-toggle="onToggle"
        :on-toggle-expand="onToggleExpand"
        :collect-ids="collectIds"
      />
    </div>
  </div>
</template>
