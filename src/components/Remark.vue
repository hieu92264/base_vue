<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="ghost"
        class="h-8 w-full justify-start"
      ></Button>
    </PopoverTrigger>
  </Popover>
</template>
