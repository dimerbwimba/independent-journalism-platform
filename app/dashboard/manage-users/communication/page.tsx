'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon,
  NewspaperIcon,
  FlagIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline"

interface CommunicationStats {
  totalContacts: number
  pendingInquiries: number
  totalReports: number
  newsletterSubscribers: number
  unreadMessages: number
}

interface Message {
  id: string
  type: 'CONTACT' | 'REPORT' | 'NEWSLETTER'
  status: 'PENDING' | 'RESOLVED' | 'SPAM'
  subject: string
  message: string
  createdAt: string
  user: {
    name: string
    email: string
    image?: string
  }
}

export default function CommunicationPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<CommunicationStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) return

    const fetchCommunicationData = async () => {
      try {
        const [statsRes] = await Promise.all([
          fetch('/api/manage-users/communication/stats'),
        ])

      
        const [statsData, ] = await Promise.all([
          statsRes.json(),
         
        ])

        setStats(statsData.stats)
       
      } catch (err) {
        setError('Failed to load communication data')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCommunicationData()
  }, [session])

  if (status === 'loading' || isLoading) {
    return <LoadingPlaceholder />
  }

  if (!session || session.user.role !== 'admin') {
    redirect('/dashboard')
  }

  if (error) {
    return <ErrorDisplay error={error} />
  }

  const statCards = [
    {
      name: 'Total Contacts',
      value: stats?.totalContacts || 0,
      icon: EnvelopeIcon,
      description: 'Total contact form submissions',
      color: 'blue'
    },
    {
      name: 'Pending Inquiries',
      value: stats?.pendingInquiries || 0,
      icon: ChatBubbleLeftRightIcon,
      description: 'Inquiries awaiting response',
      color: 'yellow'
    },
    {
      name: 'User Reports',
      value: stats?.totalReports || 0,
      icon: FlagIcon,
      description: 'Content and user reports',
      color: 'red'
    },
    {
      name: 'Newsletter Subscribers',
      value: stats?.newsletterSubscribers || 0,
      icon: NewspaperIcon,
      description: 'Active newsletter subscribers',
      color: 'green'
    }
  ]

  return (
    <div className="space-y-6 p-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Communication Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage user communications, reports, and newsletter subscriptions
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
    </div>
  )
}

function LoadingPlaceholder() {
  return (
    <div className="space-y-6 p-8 animate-pulse">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="h-8 w-64 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-48 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6">
            <div className="h-6 w-6 bg-gray-200 rounded-full mb-4" />
            <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-16 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-32 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorDisplay({ error }: { error: string }) {
  return (
    <div className="p-8">
      <div className="rounded-lg bg-red-50 p-6">
        <div className="flex items-center">
          <ExclamationCircleIcon className="h-8 w-8 text-red-400" />
          <div className="ml-4">
            <h3 className="text-lg font-medium text-red-800">Error Loading Communication Data</h3>
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
  );
} 