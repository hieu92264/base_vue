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
  <div class="flex-1 space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div class="flex items-center gap-2">
        <Button size="sm">
          <Download class="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>
    </div>

    <Tabs
      default-value="overview"
      class="space-y-4"
    >
      <TabsList>
        <TabsTrigger value="overview">Tổng quan</TabsTrigger>
        <TabsTrigger value="analytics">Phân tích</TabsTrigger>
        <TabsTrigger value="reports">Báo cáo</TabsTrigger>
      </TabsList>

      <TabsContent
        value="overview"
        class="space-y-4"
      >
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader
              class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
              <CardTitle class="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">$45,231.89</div>
              <p class="text-xs text-muted-foreground">
                <span class="text-emerald-500 font-medium">+20.1%</span> so với
                tháng trước
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
              <CardTitle class="text-sm font-medium">Subscriptions</CardTitle>
              <Users class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">+2,350</div>
              <p class="text-xs text-muted-foreground">
                <span class="text-emerald-500 font-medium">+180.1%</span> tăng
                trưởng
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
              <CardTitle class="text-sm font-medium">Sales</CardTitle>
              <CreditCard class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">+12,234</div>
              <p class="text-xs text-muted-foreground">
                <span class="text-emerald-500 font-medium">+19%</span> doanh số
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
              <CardTitle class="text-sm font-medium">Active Now</CardTitle>
              <Activity class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">+573</div>
              <p class="text-xs text-muted-foreground">
                +201 khách đang online
              </p>
            </CardContent>
          </Card>
        </div>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-3!">
          <Card class="col-span-4">
            <CardHeader>
              <CardTitle>Biểu đồ doanh thu</CardTitle>
              <CardDescription>
                Dữ liệu được cập nhật hàng giờ.
              </CardDescription>
            </CardHeader>
            <CardContent class="pl-2">
              <Overview />
            </CardContent>
          </Card>

          <Card class="col-span-3">
            <CardHeader>
              <CardTitle>Giao dịch gần đây</CardTitle>
              <CardDescription>
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
