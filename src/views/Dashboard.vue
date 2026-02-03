<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  DollarSign,
  Users,
  CreditCard,
  Activity,
  Download,
} from 'lucide-vue-next'
import RecentSales from '@/components/examples/RecentSales.vue'
import Overview from '@/components/examples/Overview.vue'
</script>

<template>
  <div class="flex-1 space-y-6 p-8 pt-6">
    <div class="flex items-center justify-between space-y-2">
      <h2 class="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
      <div class="flex items-center space-x-2">
        <Button
          size="sm"
          class="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Download class="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>
    </div>

    <Tabs
      default-value="overview"
      class="space-y-6"
    >
      <TabsList class="bg-slate-900 border border-slate-800">
        <TabsTrigger value="overview">Tổng quan</TabsTrigger>
        <TabsTrigger value="analytics">Phân tích</TabsTrigger>
        <TabsTrigger value="reports">Báo cáo</TabsTrigger>
      </TabsList>

      <TabsContent
        value="overview"
        class="space-y-6"
      >
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card
            class="border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:border-emerald-500/50 transition-all"
          >
            <CardHeader class="flex flex-row items-center justify-between pb-2">
              <CardTitle class="text-sm font-medium text-slate-400"
                >Total Revenue</CardTitle
              >
              <DollarSign class="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold text-white">$45,231.89</div>
              <p class="text-xs text-emerald-500 mt-1">
                +20.1% <span class="text-slate-500">so với tháng trước</span>
              </p>
            </CardContent>
          </Card>

          <Card class="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <CardHeader class="flex flex-row items-center justify-between pb-2">
              <CardTitle class="text-sm font-medium text-slate-400"
                >Subscriptions</CardTitle
              >
              <Users class="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold text-white">+2,350</div>
              <p class="text-xs text-blue-500 mt-1">
                +180.1% <span class="text-slate-500">tăng trưởng</span>
              </p>
            </CardContent>
          </Card>

          <Card class="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <CardHeader class="flex flex-row items-center justify-between pb-2">
              <CardTitle class="text-sm font-medium text-slate-400"
                >Sales</CardTitle
              >
              <CreditCard class="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold text-white">+12,234</div>
              <p class="text-xs text-orange-500 mt-1">
                +19% <span class="text-slate-500">doanh số</span>
              </p>
            </CardContent>
          </Card>

          <Card class="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <CardHeader class="flex flex-row items-center justify-between pb-2">
              <CardTitle class="text-sm font-medium text-slate-400"
                >Active Now</CardTitle
              >
              <Activity class="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold text-white">+573</div>
              <p class="text-xs text-rose-500 mt-1">
                +201 <span class="text-slate-500">khách đang online</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-5!">
          <Card class="col-span-4 border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle class="text-white">Biểu đồ doanh thu</CardTitle>
              <CardDescription>Dữ liệu được cập nhật hàng giờ.</CardDescription>
            </CardHeader>
            <CardContent class="pl-2">
              <Overview />
            </CardContent>
          </Card>

          <Card class="col-span-3 border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle class="text-white">Giao dịch gần đây</CardTitle>
              <CardDescription class="text-slate-400">
                Bạn có 265 đơn hàng trong tháng này.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
