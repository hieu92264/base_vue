<script setup lang="ts">
import type { IPermission } from '@/common/types/entities'
import type { TreeNode } from '@/components/TreeItem.vue'
import { useGetPermissionsQuery } from '@/modules/(organization)/permission/hooks/use-permission'
import { computed, watch } from 'vue'

const { data, isError } = useGetPermissionsQuery()
const treeNode = computed(() => {
  if (!data.value || !Array.isArray(data.value)) return []

  const permissions = data.value as IPermission[]
  const map: Record<number, TreeNode> = {}
  const roots: TreeNode[] = []

  permissions.forEach((permissions) => {
    map[permissions.id] = {
      id: permissions.id,
      name: permissions.name,
      code: permissions.code,
      url: permissions.url,
      children: [] as TreeNode[],
    }
  })

  permissions.forEach((permission) => {
    const node: TreeNode = map[permission.id]!

    if (permission.parent_id === null) {
      roots.push(node)
    } else {
      const parent = map[permission.parent_id]
      if (parent) {
        parent.children!.push(node)
      }
    }
  })

  return roots
})

watch(
  treeNode,
  (newValue) => {
    console.log('treeNode', newValue)
  },
  { immediate: true },
)
</script>

<template>hello</template>
