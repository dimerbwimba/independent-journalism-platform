'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  UserIcon, 
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import debounce from 'lodash/debounce'

interface User {
  id: string
  name: string
  email: string
  image: string | null
  role: string
  createdAt: string
}

const ROLE_FILTERS = [
  { value: '', label: 'All Users' },
  { value: 'admin', label: 'Administrators' },
  { value: 'reader', label: 'Readers' },
  { value: 'user', label: 'Regular Users' }
]

export function UsersListSidebar() {
  const pathname = usePathname()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value)
    }, 300),
    []
  )

  useEffect(() => {
    setIsLoading(true)
    fetchUsers()
  }, [searchQuery, roleFilter])

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (roleFilter) params.append('role', roleFilter)

      const response = await fetch(`/api/manage-users/roles/users-list?${params}`)
      if (!response.ok) throw new Error('Failed to fetch users')
      
      const data = await response.json()
      setUsers(data.users)
      setError(null)
    } catch (err) {
      setError('Failed to load users')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Admin</span>
      case 'reader':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Reader</span>
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">User</span>
    }
  }

  return (
    <div className="flex h-full w-64 flex-col fixed inset-y-0 bg-white border-r border-gray-200">
      <div className="flex-1 flex flex-col pt-5">
        {/* Header */}
        <div className="px-4 mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Users</h2>
        </div>

        {/* Search and Filter - Fixed */}
        <div className="px-3 space-y-3">
          {/* Search input */}
          <div className="relative rounded-md shadow-sm">
            <input
              type="search"
              placeholder="Search users..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ROLE_FILTERS.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <div className="flex">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                <p className="ml-2 text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Users List - Scrollable */}
        <div className="flex-1 overflow-y-auto mt-3">
          <div className="px-3">
            {isLoading ? (
              <div className="space-y-3 p-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200" />
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                      <div className="h-3 w-32 bg-gray-200 rounded" />
                    </div>
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
                      href={`/dashboard/manage-users/roles/${user.id}`}
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
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{user.name}</p>
                          {getRoleBadge(user.role)}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 