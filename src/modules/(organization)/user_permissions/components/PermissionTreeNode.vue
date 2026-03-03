<script setup lang="ts">
import type { IPermission } from '@/common/types/entities'
import { has } from 'lodash-es'
import { computed, onMounted, ref, watch } from 'vue'

type TreeNode = IPermission & { children?: TreeNode[] }

const props = defineProps<{
  node: TreeNode
  selected: Set<number>
  expanded: Set<number>
  onToggle: (node: TreeNode, checked: boolean) => void
  onToggleExpand: (id: number) => void
  collectIds: (node: TreeNode) => number[]
}>()

const checkboxRef = ref<HTMLInputElement | null>(null)

const hasChildren = computed(() => (props.node.children?.length ?? 0) > 0)

const allChildIds = computed(() => {
  if (!hasChildren.value) return []
  return props.node.children!.flatMap((c) => props.collectIds(c))
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
  const cnt = ids.filter((id) => props.selected.has(id)).length
  return cnt > 0 && cnt < ids.length
})

const isExpanded = computed(() => props.expanded.has(props.node.id))

watch(
  isIndeterminate,
  (v) => {
    if (checkboxRef.value) checkboxRef.value.indeterminate = v
  },
  {
    immediate: true,
  },
)

onMounted(() => {
  if (checkboxRef.value) checkboxRef.value.indeterminate = isIndeterminate.value
})

const toggle = (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked
  props.onToggle(props.node, checked)
}
</script>

<template>
  <div class="select-none">
    <div class="flex items-center gap-2 py-1">
      <button
        v-if="hasChildren"
        type="button"
        class="w-6 h-6 flex items-center justify-center rounded hover:bg-muted"
        @click="onToggleExpand(node.id)"
        :aria-label="isExpanded ? 'Collapse' : 'Expand'"
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
      class="pl-6 border-l border-muted ml-3"
    >
      <PermissionTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :selected="selected"
        :expanded="expanded"
        :onToggle="onToggle"
        :onToggleExpand="onToggleExpand"
        :collectIds="collectIds"
      />
    </div>
  </div>
</template>
