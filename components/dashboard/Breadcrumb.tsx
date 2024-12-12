'use client'

import Link from 'next/link'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid'
import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
  name: string
  href: string
  current: boolean
}

export default function Breadcrumb() {
  const pathname = usePathname()
  
  if (!pathname) return null;
  
  const paths = pathname.split('/').filter(Boolean)
  
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Dashboard', href: '/dashboard', current: paths.length === 1 },
    ...paths.slice(1).map((path, index) => {
      const href = `/dashboard/${paths.slice(1, index + 2).join('/')}`
      const name = path.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
      return {
        name,
        href,
        current: index === paths.length - 2
      }
    })
  ]

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-500">
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {breadcrumbs.map((item) => (
          <li key={item.name}>
            <div className="flex items-center">
              <ChevronRightIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              <Link
                href={item.href}
                className={`ml-4 text-sm font-medium ${
                  item.current
                    ? 'text-gray-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
} 