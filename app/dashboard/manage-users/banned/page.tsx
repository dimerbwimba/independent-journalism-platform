'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { 
  UserIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ShieldExclamationIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface BannedStats {
  totalBanned: number
  recentBans: number
  averageViolations: number
  topViolationTypes: {
    type: string
    count: number
  }[]
  bansByTimeframe: {
    timeframe: string
    count: number
  }[]
}

export default function BannedUsersPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<BannedStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/manage-users/banned/stats')
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
        <h2 className="text-2xl font-bold text-gray-900">Banned Users Overview</h2>
        <p className="mt-1 text-sm text-gray-500">
          Statistics and analytics for banned users
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Banned</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.totalBanned}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Recent Bans (30d)</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.recentBans}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ShieldExclamationIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Violations</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.averageViolations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ban Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {((stats?.recentBans || 0) / 30).toFixed(1)}/day
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Violation Types */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Violation Types</h3>
        <div className="space-y-4">
          {stats?.topViolationTypes.map((violation) => (
            <div key={violation.type} className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{violation.type}</span>
                  <span className="text-sm text-gray-500">{violation.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{
                      width: `${(violation.count / Math.max(...stats.topViolationTypes.map(v => v.count))) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ban Timeline */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ban Distribution</h3>
        <div className="space-y-4">
          {stats?.bansByTimeframe.map((timeframe) => (
            <div key={timeframe.timeframe} className="flex items-center gap-4">
              <span className="text-sm text-gray-500 w-24">{timeframe.timeframe}</span>
              <div className="flex-1 h-8 bg-gray-100 rounded-lg relative">
                <div
                  className="absolute inset-y-0 left-0 bg-red-100 rounded-lg"
                  style={{
                    width: `${(timeframe.count / Math.max(...stats.bansByTimeframe.map(t => t.count))) * 100}%`
                  }}
                />
                <span className="absolute inset-0 flex items-center justify-end pr-3 text-sm text-gray-600">
                  {timeframe.count} users
                </span>
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
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