<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { ChevronRight, File, Folder } from 'lucide-vue-next'
import { computed } from 'vue'

export interface TreeNode {
  id: number
  name: string
  code: string
  url?: string
  children?: TreeNode[]
}

const props = defineProps<{
  item: TreeNode
  level: number | 0
}>()

const hasChildren = computed(() => {
  return props.item.children && props.item.children.length > 0
})
</script>

<template>
  <div class="w-full">
    <Button
      variant="ghost"
      class="w-full justify-start h-9 px-2 font-normal hover:bg-accent/50 group"
      :style="{ paddingLeft: `${level * 16 + 8}px` }"
    >
      <div class="w-4 h-4 flex items-center justify-center">
        <ChevronRight
          v-if="hasChildren"
          class="h-3 w-3 text-muted-foreground/70"
        />

        <div
          v-else
          class="w-1 h-1 bg-muted-foreground/30 rounded-full"
        ></div>
      </div>

      <Folder
        v-if="hasChildren"
        class="h-4 w-4 mr-2 text-primary/80"
      />

      <File
        v-else
        class="w-4 h-4 mr-2 text-muted-foreground/60"
      />

      <span class="truncate text-sm">{{ item.name }}</span>
    </Button>

    <div
      v-if="hasChildren"
      class="w-full"
    >
      <TreeItem
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        :level="level + 1"
      />
    </div>
  </div>
</template>
