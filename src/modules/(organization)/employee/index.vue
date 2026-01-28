<script setup lang="ts">
import DataTable from '@/components/DataTable.vue'
import { useGetEmployeesQuery } from '@/modules/(organization)/employee/hooks/use-employee'
import { computed } from 'vue'
import type { IEmployee } from '@/common/types/entities'
import { columns } from '@/modules/(organization)/employee/data/columns'

const { data, error } = useGetEmployeesQuery()
const employeeData = computed(() => {
  console.log('Employee data error:', data.value)
  if (!data.value) return []
  const newData = Object.values(data.value) as IEmployee[]
  console.log('Employee data:', newData)
  return newData
})
</script>

<template>
  <div class="w-full px-4 py-6 overflow-auto">
    <DataTable
      :columns="columns"
      :data="employeeData"
    />
  </div>
</template>
