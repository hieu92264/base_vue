<script setup lang="ts">
import type { IPermission, IUser } from '@/common/types/entities'
import { arrayToTree } from '@/common/utils/arrayToTree.util'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGetPermissionsQuery } from '../permission/hooks/use-permission'
import { useGetUsersQuery } from '../user/hooks/use-user'
import PermissionTreeNode from './components/PermissionTreeNode.vue'
import {
  useGetUserPermissionsQuery,
  useSyncUserPermissionsMutation,
} from './hooks/use-user-permissions'

type TreeNode = IPermission & { children?: TreeNode[] }

const { t } = useI18n()

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

watch(seletedUserId, () => {
  userSearch.value = ''
  selected.value = new Set()
})

const selected = ref<Set<number>>(new Set())
const expanded = ref<Set<number>>(new Set())

const collectIds = (node: TreeNode): number[] => {
  const ids = [node.id]
  if (node.children?.length) {
    for (const child of node.children) ids.push(...collectIds(child))
  }
  return ids
}

const normalizeSelection = (
  nodes: TreeNode[],
  set: Set<number>,
): Set<number> => {
  const walk = (node: TreeNode): { total: number; checked: number } => {
    if (!node.children?.length) {
      const checked = set.has(node.id)
      return { total: 1, checked: checked ? 1 : 0 }
    }
    let total = 0
    let checked = 0
    for (const child of node.children) {
      const result = walk(child)
      total += result.total
      checked += result.checked
    }

    if (checked === total && total > 0) set.add(node.id)
    else set.delete(node.id)

    return { total, checked }
  }

  for (const root of nodes) walk(root)
  return set
}

watch(
  () => userPermRes.value,
  (value) => {
    const ids = (value as any)?.permission_ids ?? []
    selected.value = normalizeSelection(
      permissionTree.value,
      new Set<number>(ids),
    )
    expanded.value = new Set(permissionTree.value.map((item) => item.id))
  },
  { immediate: true },
)

const onToggleExpand = (id: number) => {
  const next = new Set(expanded.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expanded.value = next
}

const onToggle = (node: TreeNode, checked: boolean) => {
  const next = new Set(selected.value)
  const ids = collectIds(node)

  if (checked) {
    for (const id of ids) next.add(id)
  } else {
    for (const id of ids) next.delete(id)
  }

  selected.value = normalizeSelection(permissionTree.value, next)
}

const { mutate: syncPerms, isPending: isSaving } =
  useSyncUserPermissionsMutation()

const handleSubmit = () => {
  syncPerms({
    userId: Number(seletedUserId.value),
    permission_ids: Array.from(selected.value.values()),
  })
}

const userSearch = ref('')
const filteredUsers = computed(() => {
  const q = userSearch.value.trim().toLowerCase()
  if (!q) return users.value
  return users.value.filter((user) => {
    const haystack = `${user.username ?? ''} ${user.email ?? ''}`.toLowerCase()
    return haystack.includes(q)
  })
})
</script>

<template>
  <div class="w-full space-y-4 px-4 py-3">
    <div class="flex items-center gap-3">
      <Select v-model="seletedUserId">
        <SelectTrigger class="w-90">
          <SelectValue :placeholder="t('pages.organizationUserPermissions.selectUser')" />
        </SelectTrigger>

        <SelectContent class="max-h-65 overflow-auto">
          <div class="sticky top-0 z-10 bg-background p-2">
            <input
              v-model="userSearch"
              type="text"
              :placeholder="t('pages.organizationUserPermissions.searchUser')"
              class="h-9 w-full rounded-md border px-2 outline-none"
            />
          </div>

          <SelectItem :value="0">
            {{ t('pages.organizationUserPermissions.selectOption') }}
          </SelectItem>

          <SelectItem
            v-for="user in filteredUsers"
            :key="user.id"
            :value="user.id"
          >
            {{ user.username }}
            <span class="text-muted-foreground">
              ({{ user.email ?? t('common.noEmail') }})
            </span>
          </SelectItem>

          <div
            v-if="filteredUsers.length === 0"
            class="px-3 py-2 text-sm text-muted-foreground"
          >
            {{ t('pages.organizationUserPermissions.noUsersFound') }}
          </div>
        </SelectContent>
      </Select>

      <Button
        :disabled="
          !seletedUserId || isLoadingPerms || isFetchingUserPerm || isSaving
        "
        @click="handleSubmit"
      >
        {{
          isSaving
            ? t('pages.organizationUserPermissions.savePending')
            : t('pages.organizationUserPermissions.savePermissions')
        }}
      </Button>
    </div>

    <div
      v-if="!seletedUserId"
      class="text-sm text-muted-foreground"
    >
      {{ t('pages.organizationUserPermissions.selectUserHint') }}
    </div>

    <div
      v-else
      class="max-h-[70vh] overflow-auto rounded-md border p-3"
    >
      <div
        v-if="isLoadingPerms"
        class="text-sm text-muted-foreground"
      >
        {{ t('pages.organizationUserPermissions.loadingPermissions') }}
      </div>

      <PermissionTreeNode
        v-else
        v-for="node in permissionTree"
        :key="node.id"
        :node="node"
        :selected="selected"
        :expanded="expanded"
        :on-toggle="onToggle"
        :on-toggle-expand="onToggleExpand"
        :collect-ids="collectIds"
      />
    </div>
  </div>
</template>
