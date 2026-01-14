import {
  LayoutDashboard,
  CheckSquare,
  Package,
  MessageSquare,
  Users,
  ShieldCheck,
  Lock,
  UserX,
  FileX,
  ServerOff,
  Construction,
  Settings,
  UserCog,
  Wrench,
  Palette,
  Bell,
  Monitor,
  HelpCircle,
  Command,
  GalleryVerticalEnd,
  AudioWaveform,
  Calendar,
  FileText,
  PieChart,
} from 'lucide-vue-next'

// Mock dữ liệu Logo cho phần Secured by Clerk (nếu bạn chưa có component)
import { h } from 'vue'
const ClerkLogoMock = () =>
  h('div', { class: 'size-4 rounded-full bg-blue-500' })

export const sidebarData = {
  navGroups: [
    {
      title: '',
      items: [
        {
          title: 'Bảng điều khiển',
          url: '/',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Organization',
      items: [
        {
          title: 'Lịch làm việc',
          url: '/calendar',
          icon: Calendar,
          badge: 'New',
        },
        {
          title: 'Phân tích dữ liệu',
          url: '/analytics',
          icon: PieChart,
        },
      ],
    },
    {
      title: 'Quản lý công việc',
      items: [
        {
          title: 'Danh sách Task',
          url: '/tasks',
          icon: CheckSquare,
        },
        {
          title: 'Dự án',
          url: '/projects',
          icon: Package,
        },
        {
          title: 'Tin nhắn',
          url: '/chats',
          badge: '5',
          icon: MessageSquare,
        },
        {
          title: 'Nhân sự',
          url: '/users',
          icon: Users,
        },
      ],
    },
    {
      title: 'Hệ thống',
      items: [
        {
          title: 'Bảo mật',
          icon: ShieldCheck,
          items: [
            { title: 'Phân quyền', url: '/security/roles', icon: Lock },
            {
              title: 'Nhật ký hệ thống',
              url: '/security/logs',
              icon: FileText,
            },
          ],
        },
        {
          title: 'Cài đặt',
          icon: Settings,
          items: [
            { title: 'Hồ sơ', url: '/settings/profile', icon: UserCog },
            { title: 'Giao diện', url: '/settings/appearance', icon: Palette },
            { title: 'Thông báo', url: '/settings/notifications', icon: Bell },
          ],
        },
        {
          title: 'Trung tâm hỗ trợ',
          url: '/help',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
