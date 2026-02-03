<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const sales = [
  {
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    initial: 'OM',
    color: 'bg-blue-500',
  },
  {
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    initial: 'JL',
    color: 'bg-emerald-500',
  },
  {
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    initial: 'IN',
    color: 'bg-purple-500',
  },
  {
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    initial: 'WK',
    color: 'bg-orange-500',
  },
  {
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    initial: 'SD',
    color: 'bg-pink-500',
  },
]
</script>

<template>
  <div class="space-y-6">
    <div
      v-for="sale in sales"
      :key="sale.email"
      class="flex items-center hover:bg-slate-800/50 p-2 rounded-lg transition-colors cursor-pointer"
    >
      <Avatar class="h-10 w-10 border border-slate-700">
        <AvatarImage :src="`/avatars/${sale.initial}.png`" />
        <AvatarFallback :class="[sale.color, 'text-white']">{{
          sale.initial
        }}</AvatarFallback>
      </Avatar>
      <div class="ml-4 space-y-1 flex-1">
        <p class="text-sm font-semibold leading-none text-white">
          {{ sale.name }}
        </p>
        <p class="text-sm text-slate-500">{{ sale.email }}</p>
      </div>
      <div class="ml-auto font-bold text-emerald-400">{{ sale.amount }}</div>
    </div>
  </div>
</template>
