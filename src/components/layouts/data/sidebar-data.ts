import { useUserStore } from '@/stores/user.store'
import {
  Calendar,
  CheckSquare,
  HelpCircle,
  LayoutDashboard,
  Lock,
  Package,
  Palette,
  PieChart,
  Settings,
  UserCog,
} from 'lucide-vue-next'

export interface NavItem {
  title: string
  url?: string
  icon: any
  code?: string
  badge?: string
  children?: NavItem[]
}

interface NavGroup {
  title: string
  items: NavItem[]
}

export const getSidebarData = () => {
  const userStore = useUserStore()

  const check = (item: NavItem) => {
    if (item.url === '/') return true
    return userStore.can(item.code || '')
  }

  const masterNavGroup: NavGroup[] = [
    {
      title: '',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Organization',
      items: [
        {
          title: 'Permission',
          url: '/organizations/permissions',
          icon: Lock,
          code: '/organizations/permissions',
        },
        {
          title: 'Lịch làm việc',
          url: '/calendar',
          icon: Calendar,
          badge: 'New',
        },
        { title: 'Phân tích dữ liệu', url: '/analytics', icon: PieChart },
      ],
    },
    {
      title: 'Quản lý công việc',
      items: [
        {
          title: 'Danh sách Task',
          url: '/tasks',
          icon: CheckSquare,
          code: 'tasks',
        },
        { title: 'Dự án', url: '/projects', icon: Package, code: 'projects' },
      ],
    },
    {
      title: 'Hệ thống',
      items: [
        {
          title: 'Cài đặt',
          icon: Settings,
          children: [
            { title: 'Hồ sơ', url: '/settings/profile', icon: UserCog },
            { title: 'Giao diện', url: '/settings/appearance', icon: Palette },
          ],
        },
        { title: 'Trung tâm hỗ trợ', url: '/help', icon: HelpCircle },
      ],
    },
  ]

  const filteredNavGroups: NavGroup[] = masterNavGroup
    .map((group) => {
      const filteredItems = group.items
        .filter((item) => check(item))
        .map((item) => ({
          ...item,
          children: item.children?.filter((child) => check(child)),
        }))
        .filter((item) => !item.children || item.children.length > 0)

      return { ...group, items: filteredItems }
    })
    .filter((group) => group.items.length > 0)

  return { navGroups: filteredNavGroups }
}
