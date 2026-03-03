<script setup lang="ts">
import type { IPermission, IUser } from '@/common/types/entities'
import { useGetUsersQuery } from '../user/hooks/use-user'
import { computed, ref, watch } from 'vue'
import { useGetPermissionsQuery } from '../permission/hooks/use-permission'
import { arrayToTree } from '@/common/utils/arrayToTree.util'
import {
  useGetUserPermissionsQuery,
  useSyncUserPermissionsMutation,
} from './hooks/use-user-permissions'
import PermissionTreeNode from './components/PermissionTreeNode.vue'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type TreeNode = IPermission & { children?: TreeNode[] }

const { data: usersRes } = useGetUsersQuery()
const users = computed(() =>
  usersRes.value ? (Object.values(usersRes.value) as IUser[]) : [],
)

const { data: permsRes, isLoading: isLoadingPerms } = useGetPermissionsQuery()

const flatPermissions = computed(() => {
  if (!permsRes.value) return []
  return Object.values(permsRes.value) as IPermission[]
})

const permissionTree = computed<TreeNode[]>(
  () =>
    arrayToTree(flatPermissions.value, {
      id: 'id',
      parentId: 'parent_id',
      children: 'children',
    }) as any,
)

const seletedUserId = ref<number>(0)

const { data: userPermRes, isFetching: isFetchingUserPerm } =
  useGetUserPermissionsQuery(seletedUserId)

watch(
  seletedUserId,
  (val) => {
    userSearch.value = ''
    selected.value = new Set()
  },
  { immediate: false },
)

const selected = ref<Set<number>>(new Set())
const expanded = ref<Set<number>>(new Set())

const collectIds = (node: TreeNode): number[] => {
  const ids = [node.id]
  if (node.children?.length) {
    for (const c of node.children) ids.push(...collectIds(c))
  }
  return ids
}

const normalizeSelection = (
  nodes: TreeNode[],
  set: Set<number>,
): Set<number> => {
  const walk = (n: TreeNode): { total: number; checked: number } => {
    if (!n.children?.length) {
      const ok = set.has(n.id)
      return { total: 1, checked: ok ? 1 : 0 }
    }
    let total = 0
    let checked = 0
    for (const c of n.children) {
      const r = walk(c)
      total += r.total
      checked += r.checked
    }

    if (checked === total && total > 0) set.add(n.id)
    else set.delete(n.id)

    return { total, checked }
  }

  for (const r of nodes) walk(r)
  return set
}

watch(
  () => userPermRes.value,
  (v) => {
    const ids = (v as any)?.permission_ids ?? []
    selected.value = normalizeSelection(
      permissionTree.value,
      new Set<number>(ids),
    )
    expanded.value = new Set(permissionTree.value.map((x) => x.id))
  },
  { immediate: true },
)

const onToggleExpand = (id: number) => {
  const s = new Set(expanded.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  expanded.value = s
}

const onToggle = (node: TreeNode, checked: boolean) => {
  const s = new Set(selected.value)
  const ids = collectIds(node)

  if (checked) {
    for (const id of ids) s.add(id)
  } else {
    for (const id of ids) s.delete(id)
  }

  selected.value = normalizeSelection(permissionTree.value, s)
}

const { mutate: syncPerms, isPending: isSaving } =
  useSyncUserPermissionsMutation()

const handleSubmit = () => {
  console.log('Submitting permissions for user ID:', seletedUserId.value)
  console.log('Selected permission IDs:', Array.from(selected.value.values()))
  syncPerms({
    userId: Number(seletedUserId.value),
    permission_ids: Array.from(selected.value.values()),
  })
}

const userSearch = ref('')
const filteredUsers = computed(() => {
  const q = userSearch.value.trim().toLowerCase()
  if (!q) return users.value
  return users.value.filter((u) => {
    const hay = `${u.username ?? ''} ${u.email ?? ''}`.toLowerCase()
    return hay.includes(q)
  })
})
</script>

<template>
  <div class="w-full px-4 py-3 space-y-4">
    <div class="flex items-center gap-3">
      <Select v-model="seletedUserId">
        <SelectTrigger class="w-90">
          <SelectValue placeholder="Select user..." />
        </SelectTrigger>

        <SelectContent class="max-h-65 overflow-auto">
          <div class="p-2 sticky top-0 bg-background z-10">
            <input
              v-model="userSearch"
              type="text"
              placeholder="Search username/email..."
              class="w-full h-9 px-2 border rounded-md outline-none"
            />
          </div>

          <SelectItem :value="0">-- Choose --</SelectItem>

          <SelectItem
            v-for="u in filteredUsers"
            :key="u.id"
            :value="u.id"
          >
            {{ u.username }}
            <span class="text-muted-foreground"
              >({{ u.email ?? 'no-email' }})</span
            >
          </SelectItem>

          <div
            v-if="filteredUsers.length === 0"
            class="px-3 py-2 text-sm text-muted-foreground"
          >
            No users found
          </div>
        </SelectContent>
      </Select>

      <Button
        :disabled="
          !seletedUserId || isLoadingPerms || isFetchingUserPerm || isSaving
        "
        @click="handleSubmit"
      >
        {{ isSaving ? 'Saving...' : 'Save permissions' }}
      </Button>
    </div>

    <div
      v-if="!seletedUserId"
      class="text-sm text-muted-foreground"
    >
      Please select a user to assign permissions.
    </div>

    <div
      v-else
      class="border rounded-md p-3 max-h-[70vh] overflow-auto"
    >
      <div
        v-if="isLoadingPerms"
        class="text-sm text-muted-foreground"
      >
        Loading permissions...
      </div>

      <PermissionTreeNode
        v-else
        v-for="node in permissionTree"
        :key="node.id"
        :node="node"
        :selected="selected"
        :expanded="expanded"
        :onToggle="onToggle"
        :onToggleExpand="onToggleExpand"
        :collectIds="collectIds"
      />
    </div>
  </div>
</template>
