<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { ProfileService } from '@/services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const profileForm = reactive({
  full_name: '',
  phone_number: '',
  avatar_url: '',
  address: '',
  zalo: '',
  facebook: '',
  remark: '',
  locale: 'vi',
})

const passwordForm = reactive({
  current_password: '',
  password: '',
  password_confirmation: '',
})

const profileQuery = useQuery({
  queryKey: ['my_profile'],
  queryFn: ProfileService.getMyProfile,
})

watch(
  () => profileQuery.data.value,
  (val) => {
    const profile = val?.profile
    const user = val?.user
    if (!profile && !user) return

    profileForm.full_name = profile?.full_name ?? ''
    profileForm.phone_number = profile?.phone_number ?? ''
    profileForm.avatar_url = profile?.avatar_url ?? ''
    profileForm.address = profile?.address ?? ''
    profileForm.zalo = profile?.zalo ?? ''
    profileForm.facebook = profile?.facebook ?? ''
    profileForm.remark = profile?.remark ?? ''
    profileForm.locale = user?.locale ?? 'vi'
  },
  { immediate: true },
)

const updateProfileMutation = useMutation({
  mutationFn: () => ProfileService.updateMyProfile(profileForm),
  onSuccess: () => toast.success('Cập nhật hồ sơ thành công'),
  onError: () => toast.error('Cập nhật hồ sơ thất bại'),
})

const changePasswordMutation = useMutation({
  mutationFn: () => ProfileService.changeMyPassword(passwordForm),
  onSuccess: () => {
    toast.success('Đổi mật khẩu thành công')
    passwordForm.current_password = ''
    passwordForm.password = ''
    passwordForm.password_confirmation = ''
  },
  onError: () => toast.error('Đổi mật khẩu thất bại'),
})
</script>

<template>
  <div class="space-y-4">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h2>
      <p class="text-muted-foreground">Cập nhật thông tin và đổi mật khẩu</p>
    </div>

    <Card>
      <CardHeader><CardTitle>Thông tin cá nhân</CardTitle></CardHeader>
      <CardContent class="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Họ tên</Label>
          <Input v-model="profileForm.full_name" />
        </div>
        <div>
          <Label>Số điện thoại</Label>
          <Input v-model="profileForm.phone_number" />
        </div>
        <div>
          <Label>Avatar URL</Label>
          <Input v-model="profileForm.avatar_url" />
        </div>
        <div>
          <Label>Địa chỉ</Label>
          <Input v-model="profileForm.address" />
        </div>
        <div>
          <Label>Zalo</Label>
          <Input v-model="profileForm.zalo" />
        </div>
        <div>
          <Label>Facebook</Label>
          <Input v-model="profileForm.facebook" />
        </div>
        <div class="md:col-span-2">
          <Label>Ghi chú</Label>
          <Textarea v-model="profileForm.remark" />
        </div>
        <div class="md:col-span-2">
          <Button @click="updateProfileMutation.mutate()"> Lưu hồ sơ </Button>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Đổi mật khẩu</CardTitle></CardHeader>
      <CardContent class="grid gap-4 md:grid-cols-2">
        <div class="md:col-span-2">
          <Label>Mật khẩu hiện tại</Label>
          <Input
            v-model="passwordForm.current_password"
            type="password"
          />
        </div>
        <div>
          <Label>Mật khẩu mới</Label>
          <Input
            v-model="passwordForm.password"
            type="password"
          />
        </div>
        <div>
          <Label>Xác nhận mật khẩu mới</Label>
          <Input
            v-model="passwordForm.password_confirmation"
            type="password"
          />
        </div>
        <div class="md:col-span-2">
          <Button @click="changePasswordMutation.mutate()">
            Đổi mật khẩu
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
