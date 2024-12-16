'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { 
  ShieldExclamationIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  FlagIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface UserViolationStats {
  activeViolations: number
  resolvedViolations: number
  violationHistory: {
    id: string
    type: string
    severity: string
    description: string
    status: string
    createdAt: string
  }[]
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  warningMessage?: string
}

export default function ViolationsPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<UserViolationStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/violations/user-stats')
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

  if (!session?.user) {
    redirect('/auth/signin')
  }

  if (isLoading) return <LoadingPlaceholder />

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg bg-red-50 p-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800">Error Loading Violations</h3>
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
        <h2 className="text-2xl font-bold text-gray-900">My Violations</h2>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your content violations and warnings
        </p>
      </div>

      {/* Warning Banner */}
      {stats?.warningMessage && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{stats.warningMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className={cn(
              "p-2 rounded-lg",
              stats?.riskLevel === 'HIGH' ? "bg-red-100" :
              stats?.riskLevel === 'MEDIUM' ? "bg-yellow-100" :
              "bg-blue-100"
            )}>
              <ShieldExclamationIcon className={cn(
                "h-6 w-6",
                stats?.riskLevel === 'HIGH' ? "text-red-600" :
                stats?.riskLevel === 'MEDIUM' ? "text-yellow-600" :
                "text-blue-600"
              )} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Risk Level</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.riskLevel}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Violations</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.activeViolations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Resolved</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.resolvedViolations}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Violation History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Violation History</h3>
        <div className="space-y-4">
          {stats?.violationHistory.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No violations recorded</p>
          ) : (
            stats?.violationHistory.map((violation) => (
              <div key={violation.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <FlagIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{violation.type}</p>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        violation.severity === 'HIGH' ? "bg-red-100 text-red-800" :
                        violation.severity === 'MEDIUM' ? "bg-yellow-100 text-yellow-800" :
                        "bg-blue-100 text-blue-800"
                      )}>
                        {violation.severity}
                      </span>
                      <span className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        violation.status === 'RESOLVED' ? "bg-green-100 text-green-800" :
                        violation.status === 'APPEALED' ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      )}>
                        {violation.status}
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{violation.description}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(violation.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function LoadingPlaceholder() {
  return (
    <div className="p-8 space-y-8 animate-pulse">
      <div className="h-8 w-64 bg-gray-200 rounded" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
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