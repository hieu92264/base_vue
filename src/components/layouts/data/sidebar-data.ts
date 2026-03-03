import { useUserStore } from '@/stores/user.store'
import {
  Calendar,
  LayoutDashboard,
  Lock,
  UserCog,
  Settings,
  Palette,
  HelpCircle,
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

  const canSee = (code?: string) => {
    if (!code) return true
    return userStore.can(code)
  }

  // lọc đệ quy: parent hiện nếu nó tự có quyền HOẶC còn child nào sau lọc
  const filterItem = (item: NavItem): NavItem | null => {
    const children = item.children?.map(filterItem).filter(Boolean) as
      | NavItem[]
      | undefined
    const selfOk = canSee(item.code)
    const childOk = !!children && children.length > 0

    // item có url: cần selfOk
    // item chỉ là group (không url): hiện nếu childOk
    if (item.url) {
      if (!selfOk) return null
      return { ...item, children }
    }

    if (!childOk) return null
    return { ...item, children }
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
      title: 'Quản lý tổ chức',
      items: [
        {
          title: 'Permission',
          url: '/organizations/permissions',
          icon: Lock,
          code: 'org.permissions',
        },
        {
          title: 'Users',
          url: '/organizations/user',
          icon: UserCog,
          code: 'org.users',
        },
      ],
    },
    {
      title: 'Quản lý chung',
      items: [
        {
          title: 'Home',
          url: '/home',
          icon: Calendar,
        },
      ],
    },
    {
      title: 'Hệ thống',
      items: [
        {
          title: 'Cài đặt',
          icon: Settings,
          children: [
            { title: 'Hồ sơ', url: '/settings/profile', icon: UserCog }, // nếu cần thì thêm code
            { title: 'Giao diện', url: '/settings/appearance', icon: Palette },
          ],
        },
        { title: 'Trung tâm hỗ trợ', url: '/help', icon: HelpCircle },
      ],
    },
  ]

  const filteredNavGroups: NavGroup[] = masterNavGroup
    .map((group) => ({
      ...group,
      items: group.items.map(filterItem).filter(Boolean) as NavItem[],
    }))
    .filter((group) => group.items.length > 0)

  return { navGroups: filteredNavGroups }
}
