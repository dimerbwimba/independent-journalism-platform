'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ShieldCheckIcon,
  ExclamationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface UserDetail {
  id: string
  name: string
  email: string
  image: string | null
  role: string
  status: string
  createdAt: string
  roleHistory: {
    id: string
    previousRole: string
    newRole: string
    changedAt: string
    changedBy: {
      name: string
    }
  }[]
}

const AVAILABLE_ROLES = [
  { value: 'user', label: 'Regular User', description: 'Basic access to platform features' },
  { value: 'reader', label: 'Reader', description: 'Can read articles and comments' },
  { value: 'admin', label: 'Administrator', description: 'Full access to all platform features' }
]

export default function UserRoleDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [user, setUser] = useState<UserDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    fetchUserDetails()
  }, [id])

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/manage-users/roles/${id}/details`)
      if (!response.ok) throw new Error('Failed to fetch user details')
      
      const data = await response.json()
      setUser(data.user)
      setSelectedRole(data.user.role)
    } catch (err) {
      setError('Failed to load user details')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleUpdate = async () => {
    if (!user || selectedRole === user.role) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/manage-users/roles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole })
      })

      if (!response.ok) throw new Error('Failed to update role')
      
      await fetchUserDetails()
      setShowConfirmation(false)
    } catch (err) {
      setError('Failed to update role')
      console.error(err)
    } finally {
      setIsUpdating(false)
    }
  }

  if (!session || session.user.role !== 'admin') {
    router.push('/dashboard')
    return null
  }

  if (isLoading) return <LoadingPlaceholder />

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg bg-red-50 p-6">
          <div className="flex items-center">
            <ExclamationCircleIcon className="h-8 w-8 text-red-400" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800">Error Loading User</h3>
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

  if (!user) return null

  return (
    <div className="space-y-6 p-8">
      {/* User Info */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4">
         
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {user.role}
              </span>
              <span className="text-xs text-gray-500">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Management */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Role Management</h3>
        <div className="space-y-4">
          <div className="grid gap-4">
            {AVAILABLE_ROLES.map((role) => (
              <label
                key={role.value}
                className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                  selectedRole === role.value 
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={role.value}
                  checked={selectedRole === role.value}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="sr-only"
                />
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{role.label}</p>
                      <p className="text-gray-500">{role.description}</p>
                    </div>
                  </div>
                  {selectedRole === role.value && (
                    <ShieldCheckIcon className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </label>
            ))}
          </div>

          {selectedRole !== user.role && (
            <div className="flex justify-end">
              <button
                onClick={() => setShowConfirmation(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Update Role
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Role History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Role History</h3>
        <div className="space-y-4">
          {user.roleHistory.length > 0 ? (
            user.roleHistory.map((change) => (
              <div key={change.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <ArrowPathIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100">
                      {change.previousRole}
                    </span>
                    <span>→</span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {change.newRole}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    Changed by {change.changedBy.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(change.changedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No role changes recorded</p>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900">Confirm Role Change</h3>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to change this user&apos;s role from {user.role} to {selectedRole}?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleUpdate}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:opacity-50"
              >
                {isUpdating ? 'Updating...' : 'Confirm'}
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
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="h-48 bg-gray-200 rounded" />
      </div>
    </div>
  )
} 