'use client'

import { Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { 

  GlobeAmericasIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'

interface UserData {
  id: string
  name: string | null
  email: string
  image: string | null
  createdAt: string
  role: string
  username: string | null
  accountNumber: string
  connectedAccounts: string[]
}

const providerIcons = {
  google: <GlobeAmericasIcon className="w-5 h-5" />,
  credentials: <LockClosedIcon className="w-5 h-5 text-gray-600" />
}

const providerNames = {
  google: 'Google Account',
  credentials: 'Password'
}

function AccountContent() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/account')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch account data')
        }

        setUserData(data.user)
        setError(null)
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchUserData()
    }
  }, [session])

  if (!session) return null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading your account information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 text-red-600 p-4 rounded-lg">
            <p className="font-medium">Error loading account</p>
            <p className="text-sm mt-1">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 text-sm text-blue-600 hover:text-blue-500"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">No account data available</p>
        </div>
      </div>
    )
  }

  const joinedDate = new Date(userData.createdAt)
  const greeting = getGreeting()

  function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  function getYear(date: Date) {
    return date.getFullYear()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{greeting}.</h1>
          <p className="mt-1 text-sm text-gray-500">
            You&apos;ve supported independent journalism since {getYear(joinedDate)}
          </p>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account information</h2>
          
          <div className="space-y-6">
            {/* Account Number */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Account number</p>
                <p className="mt-1 text-sm text-gray-900">{userData.accountNumber}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start justify-between border-t pt-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Email address</p>
                <p className="mt-1 text-sm text-gray-900">{userData.email}</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                Update
              </button>
            </div>

            {/* Password */}
            <div className="flex items-start justify-between border-t pt-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Password</p>
                <p className="mt-1 text-sm text-gray-900">None</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                Create
              </button>
            </div>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Connected accounts</h2>
          <div className="space-y-4">
            {userData.connectedAccounts.map((provider) => (
              <div 
                key={provider} 
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                    {providerIcons[provider.toLowerCase() as keyof typeof providerIcons]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {providerNames[provider.toLowerCase() as keyof typeof providerNames]}
                    </p>
                    <p className="text-xs text-gray-500">
                      {provider === 'google' 
                        ? 'Sign in with Google Account' 
                        : 'Sign in with email and password'
                      }
                    </p>
                  </div>
                </div>
                <button 
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium flex items-center space-x-1"
                >
                  <span>Manage</span>
                </button>
              </div>
            ))}

            {userData.connectedAccounts.length === 0 && (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <LockClosedIcon className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No connected accounts</p>
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-500 font-medium">
                  Add account
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your profile</h2>
          
          <div className="space-y-6">
            {/* Name */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="mt-1 text-sm text-gray-900">
                  {userData.name || 'No name added'}
                </p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                Update
              </button>
            </div>

            {/* Username */}
            <div className="flex items-start justify-between border-t pt-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Username</p>
                <p className="mt-1 text-sm text-gray-900">
                  {userData.username || 'No username added'}
                </p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Saved Places */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Saved places</h2>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-900">No places added</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountContent />
    </Suspense>
  )
} 