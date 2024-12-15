'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  UserIcon, 
  FunnelIcon,
  XCircleIcon,
  ShieldExclamationIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import debounce from 'lodash/debounce'

interface User {
  id: string
  name: string
  email: string
  image: string | null
  status: 'ACTIVE' | 'BANNED' | 'SUSPENDED'
  role: string
  createdAt: string
  stats: {
    violations: number
    posts: number
  }
  lastViolation: {
    type: string
    description: string
    createdAt: string
  } | null
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Users' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'BANNED', label: 'Banned' },
  { value: 'SUSPENDED', label: 'Suspended' }
]

export function UsersListSideBar() {
  const pathname = usePathname()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value)
    }, 300),
    []
  )

  useEffect(() => {
    fetchUsers()
  }, [searchQuery, statusFilter])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter && { status: statusFilter })
      })

      const response = await fetch(`/api/manage-users/banned/users-list?${params}`)
      if (!response.ok) throw new Error('Failed to fetch users')
      
      const data = await response.json()
      setUsers(data.users)
    } catch (err) {
      setError('Failed to load users')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'BANNED':
        return <ShieldExclamationIcon className="h-4 w-4 text-red-500" />
      case 'SUSPENDED':
        return <ClockIcon className="h-4 w-4 text-yellow-500" />
      case 'ACTIVE':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  if (error) {
    return (
      <div className="fixed inset-y-0 w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center gap-2 text-red-500">
          <XCircleIcon className="h-5 w-5" />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-y-0 w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Users</h2>
          
          {/* Search */}
          <div className="mt-4 relative">
            <input
              type="search"
              placeholder="Search users..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FunnelIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} {option.value && `(${
                  users.filter(u => u.status === option.value).length
                })`}
              </option>
            ))}
          </select>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="space-y-2 p-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-100 rounded-md" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <UserIcon className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">No users found</p>
                </div>
              ) : (
                users.map((user) => (
                  <Link
                    key={user.id}
                    href={`/dashboard/manage-users/banned/${user.id}`}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-md text-sm transition-colors",
                      pathname.includes(user.id) 
                        ? "bg-gray-100 text-gray-900" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    {user.image ? (
                      <img
                        src={user.image}
                        alt=""
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{user.name}</p>
                        {getStatusIcon(user.status)}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      {user.stats.violations > 0 && (
                        <p className="text-xs text-red-600 mt-1">
                          {user.stats.violations} violations
                        </p>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 