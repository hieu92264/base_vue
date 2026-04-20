import i18n from '@/configs/i18n.config'
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
  const t = (key: string) => (i18n.global as any).t(key) as string

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
            title: t('layout.sidebar.admin'),
            items: [
              {
                title: t('layout.sidebar.dashboardAdmin'),
                url: '/organizations/dashboard',
                icon: LayoutDashboard,
                code: 'org.dashboard',
              },
              {
                title: t('layout.sidebar.permissions'),
                url: '/organizations/permissions',
                icon: Lock,
                code: 'org.permissions',
              },
              {
                title: t('layout.sidebar.categories'),
                url: '/organizations/categories',
                icon: Tag,
                code: 'org.categories',
              },
              {
                title: t('layout.sidebar.users'),
                url: '/organizations/user',
                icon: UserCog,
                code: 'org.users',
              },
              {
                title: t('layout.sidebar.userPermissions'),
                url: '/organizations/user-permissions',
                icon: ShieldCheck,
                code: 'org.user-permissions',
              },
              {
                title: t('layout.sidebar.sliders'),
                url: '/organizations/sliders',
                icon: Calendar,
                code: 'org.sliders',
              },
              {
                title: t('layout.sidebar.roomModeration'),
                url: '/organizations/room-moderation',
                icon: FileCheck,
                code: 'org.room-moderation',
              },
              {
                title: t('layout.sidebar.contacts'),
                url: '/organizations/contacts',
                icon: MessagesSquare,
                code: 'org.contacts',
              },
              {
                title: t('layout.sidebar.deals'),
                url: '/organizations/deals',
                icon: Handshake,
                code: 'org.bookings',
              },
              {
                title: t('layout.sidebar.reviews'),
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
            title: t('layout.sidebar.landlord'),
            items: [
              {
                title: t('layout.sidebar.landlordDashboard'),
                url: '/landlord/dashboard',
                icon: House,
              },
              {
                title: t('layout.sidebar.myRooms'),
                url: '/landlord/my-rooms',
                icon: ClipboardList,
              },
              {
                title: t('layout.sidebar.myLeads'),
                url: '/landlord/contacts',
                icon: MessagesSquare,
              },
              {
                title: t('layout.sidebar.myDeals'),
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
            title: t('layout.sidebar.tenant'),
            items: [
              {
                title: t('layout.sidebar.home'),
                url: '/home',
                icon: Home,
              },
            ],
          },
          {
            title: t('layout.sidebar.tenantRooms'),
            items: [
              {
                title: t('layout.sidebar.dashboard'),
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
      title: t('layout.sidebar.system'),
      items: [
        {
          title: t('layout.sidebar.settings'),
          icon: Settings,
          children: [
            {
              title: t('layout.sidebar.profile'),
              url: '/settings/profile',
              icon: UserCog,
            },
            {
              title: t('layout.sidebar.appearance'),
              url: '/settings/appearance',
              icon: Palette,
            },
          ],
        },
        {
          title: t('layout.sidebar.helpCenter'),
          url: '/help',
          icon: HelpCircle,
        },
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
