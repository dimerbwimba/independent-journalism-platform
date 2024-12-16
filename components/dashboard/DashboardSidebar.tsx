'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { 
  HomeIcon, 
  PencilIcon,
  UserIcon,
  ChevronUpIcon,
  ArrowRightOnRectangleIcon,
  TagIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  ClockIcon,
  BanknotesIcon,
  ChatBubbleLeftRightIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  description?: string
  alert?: {
    count: number
    type: 'danger' | 'warning'
  }
}

interface ViolationCount {
  count: number
}

// Base navigation items for all users
const baseNavigation: NavigationItem[] = [
  { name: 'Creator Analytics', href: '/dashboard', icon: HomeIcon },
  { 
    name: 'Posts',
    href: '/dashboard/posts',
    icon: PencilIcon,
  },
  { 
    name: 'Activity',
    href: '/dashboard/activity',
    icon: ClockIcon,
  },
  { 
    name: 'My Inquiries',
    href: '/dashboard/inquiries',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: 'Monetization',
    href: '/dashboard/monetization',
    icon: BanknotesIcon,
  },
  {
    name: 'Violations',
    href: '/dashboard/violations',
    icon: ShieldExclamationIcon,
    description: 'View and manage content violations',
    alert: undefined
  }
]

// Admin-only navigation items
const adminNavigation: NavigationItem[] = [
  { 
    name: 'Categories',
    href: '/dashboard/categories',
    icon: TagIcon,
  },
  {
    name: 'Approve Articles',
    href: '/dashboard/approve',
    icon: ClipboardDocumentCheckIcon,
  },
  {
    name: 'Global Analytics',
    href: '/dashboard/analytics',
    icon: ChartBarIcon,
  },
  {
    name: "Manage Monetization",
    href: "/dashboard/manage-monetization",
    icon: BanknotesIcon,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [violationCount, setViolationCount] = useState<number>(0)

  useEffect(() => {
    if (session?.user) {
      fetchViolationCount()
    }
  }, [session])

  const fetchViolationCount = async () => {
    try {
      const response = await fetch('/api/violations/user-count')
      if (response.ok) {
        const data: ViolationCount = await response.json()
        setViolationCount(data.count)
      }
    } catch (error) {
      console.error('Failed to fetch violation count:', error)
    }
  }

  const isAdmin = session?.user?.role === 'admin'
  
  // Combine navigation items based on user role
  const navigation = isAdmin 
    ? [...baseNavigation, ...adminNavigation]
    : baseNavigation

  // Update navigation with violation count
  const navigationWithCount = navigation.map(item => {
    if (item.name === 'Violations' && violationCount > 0) {
      return {
        ...item,
        alert: {
          count: violationCount,
          type: 'danger' as const
        }
      }
    }
    return item
  })

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="flex h-full w-64 flex-col fixed inset-y-0 bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-12 items-center px-6 ">
        
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigationWithCount.map((item) => {
          const isActive = pathname.startsWith(item.href)
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                "hover:bg-gray-100 hover:text-gray-900",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                isActive ? 
                  "bg-gray-100 text-gray-900" : 
                  "text-gray-700",
                item.alert?.type === 'danger' && "text-red-600 hover:text-red-700"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
              {item.alert && (
                <span className={cn(
                  "inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full",
                  item.alert.type === 'danger' ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                )}>
                  {item.alert.count}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Profile with Dropdown */}
      {session?.user && (
        <div className="relative border-t border-gray-200">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex w-full items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
          >
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || 'User avatar'}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-gray-500" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session.user.name || 'User Name'}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500 truncate">
                  {session.user.email || 'user@example.com'}
                </p>
                {isAdmin && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                    Admin
                  </span>
                )}
              </div>
            </div>
            <ChevronUpIcon 
              className={cn(
                "h-5 w-5 text-gray-400 transition-transform duration-200",
                isDropdownOpen ? "rotate-0" : "rotate-180"
              )} 
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute bottom-full left-0 w-full bg-white border-t border-gray-200 shadow-lg rounded-t-lg overflow-hidden">
              <Link
                href="/dashboard/profile"
                className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <UserIcon className="h-5 w-5 text-gray-400" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-400" />
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 