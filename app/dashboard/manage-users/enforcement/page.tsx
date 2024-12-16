'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { 
  ShieldExclamationIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  FlagIcon
} from '@heroicons/react/24/outline'

interface EnforcementStats {
  totalViolations: number
  activeWarnings: number
  pendingReviews: number
  recentActions: {
    id: string
    type: string
    description: string
    createdAt: string
    user: {
      name: string
      email: string
    }
  }[]
}

export default function EnforcementPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<EnforcementStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/manage-users/enforcement/stats')
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

  if (isLoading) {
    return <LoadingPlaceholder />
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg bg-red-50 p-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800">Error Loading Statistics</h3>
              <p className="mt-2 text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Guidelines Enforcement</h2>
        <p className="mt-1 text-sm text-gray-500">
          Monitor and manage content and behavior violations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ShieldExclamationIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Violations</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.totalViolations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Warnings</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.activeWarnings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.pendingReviews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Enforcement Actions</h3>
        <div className="space-y-4">
          {stats?.recentActions.map((action) => (
            <div key={action.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <FlagIcon className="h-5 w-5 text-gray-400 mt-1" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{action.type}</p>
                <p className="mt-1 text-sm text-gray-500">{action.description}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <span>{action.user.name}</span>
                  <span>•</span>
                  <span>{new Date(action.createdAt).toLocaleDateString()}</span>
                </div>
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
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