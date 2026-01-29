<script setup lang="ts">
import DataTable from '@/components/DataTable.vue'
import { useGetEmployeesQuery } from '@/modules/(organization)/employee/hooks/use-employee'
import { computed } from 'vue'
import type { IEmployee } from '@/common/types/entities'
import { columns } from '@/modules/(organization)/employee/data/columns'
import { Button } from '@/components/ui/button'
import { Download, Funnel, Plus, RefreshCcw } from 'lucide-vue-next'

const { data, error, isLoading, isFetching, refetch } = useGetEmployeesQuery()
const employeeData = computed(() => {
  console.log('Employee data error:', data.value)
  if (!data.value) return []
  const newData = Object.values(data.value) as IEmployee[]
  console.log('Employee data:', newData)
  return newData
})
</script>

<template>
  <div class="w-full px-4 py-2 overflow-auto">
    <DataTable
      :columns="columns"
      :data="employeeData"
      :loading="isLoading || isFetching"
      show-toolbar
      :refetch-data="refetch"
      :is-fetching="isFetching"
    >
    </DataTable>
  </div>
</template>
