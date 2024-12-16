'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { 
  ShieldCheckIcon,
  ArrowPathIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

interface RoleStats {
  totalUsers: number
  roleDistribution: {
    role: string
    count: number
    percentage: number
  }[]
  recentChanges: {
    id: string
    userId: string
    userName: string
    previousRole: string
    newRole: string
    changedAt: string
  }[]
}

export default function RolesPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<RoleStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/manage-users/roles/stats')
      if (!response.ok) throw new Error('Failed to fetch statistics')
      
      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError('Failed to load statistics')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!session || session.user.role !== 'admin') {
    redirect('/dashboard')
  }

  if (isLoading) return <LoadingPlaceholder />

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg bg-red-50 p-6">
          <div className="flex items-center">
            <ExclamationCircleIcon className="h-8 w-8 text-red-400" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800">Error Loading Data</h3>
              <p className="mt-2 text-red-700">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Role Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage user roles and permissions
          </p>
        </div>
      </div>

      {/* Role Distribution */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {stats?.roleDistribution.map((role) => (
          <div key={role.role} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{role.role}</p>
                  <p className="text-2xl font-semibold text-gray-900">{role.count}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {role.percentage.toFixed(1)}%
              </div>
            </div>
            <div className="mt-4">
              <div className="relative w-full h-2 bg-gray-200 rounded-full">
                <div 
                  className="absolute inset-y-0 left-0 bg-blue-500 rounded-full"
                  style={{ width: `${role.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Changes */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Role Changes</h3>
        <div className="space-y-4">
          {stats?.recentChanges.map((change) => (
            <div key={change.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <ArrowPathIcon className="h-5 w-5 text-gray-400 mt-1" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{change.userName}</p>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100">
                    {change.previousRole}
                  </span>
                  <span>→</span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {change.newRole}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(change.changedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LoadingPlaceholder() {
  return (
    <div className="p-8 space-y-8 animate-pulse">
      <div className="h-8 w-64 bg-gray-200 rounded" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6">
            <div className="h-16 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="h-48 bg-gray-100 rounded" />
      </div>
    </div>
  )
} 