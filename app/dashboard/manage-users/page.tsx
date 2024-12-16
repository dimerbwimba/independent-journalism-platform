'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { 
  UsersIcon, 
  ShieldExclamationIcon, 
  TrashIcon,
  DocumentCheckIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";
import Link from 'next/link';

interface AdminStats {
  totalUsers: number
  bannedUsers: number
  pendingModeration: number
  activeViolations: number
}

export default function ManageUsersPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) return

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/manage-users/stats')
        if (!response.ok) throw new Error('Failed to fetch statistics')
        
        const data = await response.json()
        setStats(data.stats)
      } catch (err) {
        setError('Failed to load dashboard statistics')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [session])

  if (status === 'loading' || isLoading) {
    return <LoadingPlaceholder />
  }

  if (!session || session.user.role !== 'admin') {
    redirect('/dashboard')
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg bg-red-50 p-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-6 w-6 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Dashboard</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      name: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: UsersIcon,
      description: 'Total registered users on the platform',
      color: 'blue'
    },
    {
      name: 'Banned Users',
      value: stats?.bannedUsers || 0,
      icon: TrashIcon,
      description: 'Currently banned accounts',
      color: 'red'
    },
    {
      name: 'Pending Moderation',
      value: stats?.pendingModeration || 0,
      icon: DocumentCheckIcon,
      description: 'Posts awaiting review',
      color: 'indigo'
    },
    {
      name: 'Active Violations',
      value: stats?.activeViolations || 0,
      icon: ShieldExclamationIcon,
      description: 'Pending guideline violations',
      color: 'yellow'
    }
  ]

  return (
    <div className="space-y-6 p-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            User Management Overview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Comprehensive dashboard for managing users, content, and platform safety
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className={`absolute rounded-md bg-${stat.color}-500 p-3`}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </dd>
            <p className="mt-2 text-sm text-gray-500">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              User Management Tools
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Access tools for managing user accounts, roles, and permissions.</p>
            </div>
            <div className="mt-5 space-y-2">
              <Link href="/dashboard/manage-users/roles" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <>
              <ShieldCheckIcon className="h-5 w-5 mr-2 text-gray-400" />
                Manage Roles & Permissions
              </>  
              </Link>
              <Link href="/dashboard/manage-users/communication" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
               <>
               <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-400" />
                User Communications
               </> 
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Safety & Compliance
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Tools for maintaining platform safety and guideline compliance.</p>
            </div>
            <div className="mt-5 space-y-2">
              <Link href="/dashboard/manage-users/enforcement" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <ShieldExclamationIcon className="h-5 w-5 mr-2 text-gray-400" />
                Review Violations
              </Link>
              <Link href="/dashboard/manage-users/moderation" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <DocumentCheckIcon className="h-5 w-5 mr-2 text-gray-400" />
                Content Moderation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingPlaceholder() {
  return (
    <div className="space-y-6 p-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="h-8 w-60 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
            <div className="h-8 w-8 bg-gray-200 rounded-full mb-4" />
            <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-16 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
            <div className="h-4 w-48 bg-gray-200 rounded mb-6" />
            <div className="space-y-3">
              <div className="h-10 w-40 bg-gray-200 rounded" />
              <div className="h-10 w-40 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 