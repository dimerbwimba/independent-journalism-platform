'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { 
  UserIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'

interface UserDetail {
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
  violations: {
    id: string
    type: string
    severity: string
    description: string
    status: string
    createdAt: string
  }[]
}

export default function UserDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const router = useRouter()
  const { data: session } = useSession()
  const [user, setUser] = useState<UserDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBanning, setIsBanning] = useState(false)

  useEffect(() => {
    fetchUserDetails()
  }, [id])

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/manage-users/banned/${id}/user-details`)
      if (!response.ok) throw new Error('Failed to fetch user details')
      
      const data = await response.json()
      setUser(data.user)
    } catch (err) {
      setError('Failed to load user details')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBanStatusChange = async () => {
    if (!user || !confirm(`Are you sure you want to ${user.status === 'BANNED' ? 'unban' : 'ban'} this user?`)) return

    try {
      setIsBanning(true)
      const response = await fetch(`/api/manage-users/banned/${user.id}/ban-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: user.status === 'BANNED' ? 'unban' : 'ban',
          reason: user.status === 'BANNED' ? 'Manual unban by admin' : 'Manual ban by admin'
        })
      })

      if (!response.ok) throw new Error('Failed to update ban status')
      
      await fetchUserDetails()
    } catch (err) {
      setError('Failed to update ban status')
      console.error(err)
    } finally {
      setIsBanning(false)
    }
  }

  if (!session || session.user.role !== 'admin') {
    router.push('/dashboard')
    return null
  }

  if (isLoading) {
    return <LoadingPlaceholder />
  }

  if (error || !user) {
    return (
      <div className="p-8">
        <div className="rounded-lg bg-red-50 p-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800">Error Loading User</h3>
              <p className="mt-2 text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* User Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* <UserAvatar user={user}  /> */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  user.status === 'BANNED' ? 'bg-red-100 text-red-800' :
                  user.status === 'SUSPENDED' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.status}
                </span>
                <span className="text-sm text-gray-500">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleBanStatusChange}
            disabled={isBanning}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              user.status === 'BANNED'
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-red-600 text-white hover:bg-red-700'
            } disabled:opacity-50`}
          >
            {isBanning ? 'Processing...' : user.status === 'BANNED' ? 'Unban User' : 'Ban User'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <ShieldExclamationIcon className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Violations</p>
              <p className="text-2xl font-semibold text-gray-900">{user.stats.violations}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Posts</p>
              <p className="text-2xl font-semibold text-gray-900">{user.stats.posts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <UserIcon className="h-8 w-8 text-gray-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Role</p>
              <p className="text-2xl font-semibold text-gray-900">{user.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Violations History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Violation History</h3>
        {user.violations.length > 0 ? (
          <div className="space-y-4">
            {user.violations.map((violation) => (
              <div key={violation.id} className="border-l-4 border-red-400 pl-4 py-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{violation.type}</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    violation.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                    violation.status === 'APPEALED' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {violation.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{violation.description}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(violation.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No violations recorded</p>
        )}
      </div>
    </div>
  )
}

function LoadingPlaceholder() {
  return (
    <div className="p-8 space-y-8 animate-pulse">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-gray-200 rounded-full" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6">
            <div className="h-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
} 