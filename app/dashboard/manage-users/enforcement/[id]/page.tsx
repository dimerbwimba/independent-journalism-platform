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
  status: string
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

type ActionType = 'WARNING' | 'SUSPENSION' | 'BAN' | 'RESOLVE'

export default function UserEnforcementPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [user, setUser] = useState<UserDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [actionReason, setActionReason] = useState('')
  const [showActionModal, setShowActionModal] = useState(false)
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null)

  useEffect(() => {
    fetchUserDetails()
  }, [id])

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/manage-users/enforcement/${id}/details`)
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

  const handleAction = async () => {
    if (!user || !selectedAction || !actionReason) return

    try {
      setIsActionLoading(true)
      const response = await fetch(`/api/manage-users/enforcement/${user.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: selectedAction,
          reason: actionReason
        })
      })

      if (!response.ok) throw new Error('Failed to perform action')
      
      const data = await response.json()
      
      // Show notifications
      if (data.autoBanned) {
        alert('User has been automatically banned due to exceeding violation limit')
      }
      if (data.adminRevoked) {
        alert('Admin privileges have been revoked due to suspension/ban')
      }
      
      await fetchUserDetails()
      setShowActionModal(false)
      setActionReason('')
      setSelectedAction(null)
    } catch (err) {
      setError('Failed to perform action')
      console.error(err)
    } finally {
      setIsActionLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (!session || session.user.role !== 'admin') {
    router.push('/dashboard')
    return null
  }

  if (isLoading) return <LoadingPlaceholder />

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
        <div className=" items-start justify-between">
          <div className="flex items-center gap-4">
            {/* <UserAvatar user={user} /> */}
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
          <div className=" flex justify-between mt-5">
            <button
              onClick={() => {
                setSelectedAction('WARNING')
                setShowActionModal(true)
              }}
              className="px-3 py-2 text-sm font-medium rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
            >
              Issue Warning
            </button>
            <button
              onClick={() => {
                setSelectedAction('SUSPENSION')
                setShowActionModal(true)
              }}
              className="px-3 py-2 text-sm font-medium rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100"
            >
              Suspend User
            </button>
            <button
              onClick={() => {
                setSelectedAction('BAN')
                setShowActionModal(true)
              }}
              className="px-3 py-2 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
            >
              Ban User
            </button>
          </div>
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
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      getSeverityColor(violation.severity)
                    }`}>
                      {violation.severity}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      violation.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                      violation.status === 'APPEALED' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {violation.status}
                    </span>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-600">{violation.description}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(violation.createdAt).toLocaleDateString()}
                </p>
                {violation.status === 'PENDING' && (
                  <button
                    onClick={() => {
                      setSelectedAction('RESOLVE')
                      setShowActionModal(true)
                    }}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-500"
                  >
                    Resolve Violation
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No violations recorded</p>
        )}
      </div>

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900">
              {selectedAction === 'WARNING' ? 'Issue Warning' :
               selectedAction === 'SUSPENSION' ? 'Suspend User' :
               selectedAction === 'BAN' ? 'Ban User' : 'Resolve Violation'}
            </h3>
            <div className="mt-4">
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Enter reason..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={4}
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowActionModal(false)
                  setActionReason('')
                  setSelectedAction(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={isActionLoading || !actionReason}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:opacity-50"
              >
                {isActionLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
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