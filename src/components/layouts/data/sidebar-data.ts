import { useUserStore } from '@/stores/user.store'
import {
  Calendar,
  LayoutDashboard,
  Lock,
  UserCog,
  Settings,
  Palette,
  HelpCircle,
  ShieldCheck,
  Tag,
  House,
  ClipboardList,
  FileCheck,
  MessagesSquare,
  Star,
  Handshake,
  Home,
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

  const currentRole = userStore.user?.profile?.user_type ?? 'tenant'
  const isAdmin = currentRole === 'admin'
  const isLandlord = currentRole === 'landlord'
  const isTenant = currentRole === 'tenant'

  const filterItem = (item: NavItem): NavItem | null => {
    const children = item.children?.map(filterItem).filter(Boolean) as
      | NavItem[]
      | undefined

    const selfOk = canSee(item.code)
    const childOk = !!children && children.length > 0

    if (item.url) {
      if (!selfOk) return null
      return { ...item, children }
    }

    if (!childOk) return null
    return { ...item, children }
  }

  const roleGroups: NavGroup[] = [
    ...(isAdmin
      ? [
          {
            title: 'Quản trị hệ thống',
            items: [
              {
                title: 'Dashboard admin',
                url: '/organizations/dashboard',
                icon: LayoutDashboard,
                code: 'org.dashboard',
              },
              {
                title: 'Quyền hạn',
                url: '/organizations/permissions',
                icon: Lock,
                code: 'org.permissions',
              },
              {
                title: 'Danh mục',
                url: '/organizations/categories',
                icon: Tag,
                code: 'org.categories',
              },
              {
                title: 'Người dùng',
                url: '/organizations/user',
                icon: UserCog,
                code: 'org.users',
              },
              {
                title: 'Gán quyền user',
                url: '/organizations/user-permissions',
                icon: ShieldCheck,
                code: 'org.user-permissions',
              },
              {
                title: 'Slider',
                url: '/organizations/sliders',
                icon: Calendar,
                code: 'org.sliders',
              },
              {
                title: 'Duyệt tin đăng',
                url: '/organizations/room-moderation',
                icon: FileCheck,
                code: 'org.room-moderation',
              },
              {
                title: 'Contact / Lead',
                url: '/organizations/contacts',
                icon: MessagesSquare,
                code: 'org.contacts',
              },
              {
                title: 'Deal / Booking',
                url: '/organizations/deals',
                icon: Handshake,
                code: 'org.bookings',
              },
              {
                title: 'Review / Comment',
                url: '/organizations/reviews',
                icon: Star,
                code: 'org.reviews',
              },
            ],
          },
        ]
      : []),
    ...(isLandlord
      ? [
          {
            title: 'Chủ nhà',
            items: [
              {
                title: 'Dashboard chủ nhà',
                url: '/landlord/dashboard',
                icon: House,
              },
              {
                title: 'Danh sách tin của tôi',
                url: '/landlord/my-rooms',
                icon: ClipboardList,
              },
              {
                title: 'Lead của tôi',
                url: '/landlord/contacts',
                icon: MessagesSquare,
              },
              {
                title: 'Deal của tôi',
                url: '/landlord/deals',
                icon: Handshake,
              },
            ],
          },
        ]
      : []),
    ...(isTenant
      ? [
          {
            title: 'Người thuê',
            items: [
              {
                title: 'Trang chủ',
                url: '/home',
                icon: Home,
              },
            ],
          },
          {
            title: 'Phòng đã liên hệ',
            items: [
              {
                title: 'Dashboard',
                url: '/tenant/dashboard',
                icon: Handshake,
              },
            ],
          },
        ]
      : []),
  ]

  const sharedGroups: NavGroup[] = [
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

  const filteredNavGroups: NavGroup[] = [...roleGroups, ...sharedGroups]
    .map((group) => ({
      ...group,
      items: group.items.map(filterItem).filter(Boolean) as NavItem[],
    }))
    .filter((group) => group.items.length > 0)

  return { navGroups: filteredNavGroups }
}
