'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { 
  DocumentTextIcon,
  DocumentPlusIcon,
  DocumentMagnifyingGlassIcon,
  ArchiveBoxIcon,
  ChartBarIcon,
  TagIcon
} from '@heroicons/react/24/outline'

const baseNavigation = [
  {
    name: 'All Posts',
    href: '/dashboard/posts',
    icon: DocumentTextIcon,
    description: 'View all your posts'
  },
  {
    name: 'Create New',
    href: '/dashboard/posts/create',
    icon: DocumentPlusIcon,
    description: 'Start writing a new post'
  },
  {
    name: 'Analytics',
    href: '/dashboard/posts/analytics',
    icon: ChartBarIcon,
    description: 'View post performance'
  }
]

const adminNavigation = [
  {
    name: 'Pending Review',
    href: '/dashboard/posts/pending',
    icon: DocumentMagnifyingGlassIcon,
    description: 'Review posts awaiting approval'
  },
  {
    name: 'Archived',
    href: '/dashboard/posts/archived',
    icon: ArchiveBoxIcon,
    description: 'View archived posts'
  },
  {
    name: 'Categories',
    href: '/dashboard/posts/categories',
    icon: TagIcon,
    description: 'View post categories'
  }
]

export function PostsSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'

  return (
    <div className="fixed top-12  bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto scrollbar ">
      <div className="p-4">
        <nav className="space-y-1">
          <div className="space-y-2">
            {baseNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col p-3 rounded-lg hover:bg-gray-50",
                  pathname === item.href && "bg-gray-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn(
                    "h-5 w-5",
                    pathname === item.href ? "text-blue-600" : "text-gray-400"
                  )} />
                  <span className={cn(
                    "text-sm font-medium",
                    pathname === item.href ? "text-blue-600" : "text-gray-700"
                  )}>
                    {item.name}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 ml-8">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>

          {isAdmin && (
            <>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-xs text-gray-500">
                    Admin Controls
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {adminNavigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex flex-col p-3 rounded-lg hover:bg-gray-50",
                      pathname === item.href && "bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn(
                        "h-5 w-5",
                        pathname === item.href ? "text-blue-600" : "text-gray-400"
                      )} />
                      <span className={cn(
                        "text-sm font-medium",
                        pathname === item.href ? "text-blue-600" : "text-gray-700"
                      )}>
                        {item.name}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 ml-8">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </nav>
      </div>
    </div>
  )
} 