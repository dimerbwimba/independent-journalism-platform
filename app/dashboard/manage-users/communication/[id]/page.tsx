'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { 
  EnvelopeIcon, 
  FlagIcon,
  CalendarIcon,
  UserIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowLeftIcon,
  LinkIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface CommunicationDetail {
  type: 'CONTACT' | 'REPORT'
  data: {
    id: string
    subject?: string
    message?: string
    reason?: string
    details?: string
    status: string
    createdAt: string
    user: {
      name: string
      email: string
      image?: string
      createdAt: string
    }
    post?: {
      title: string
      slug: string
    }
  }
}

export default function CommunicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [communication, setCommunication] = useState<CommunicationDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchCommunication = async () => {
      try {
        const response = await fetch(`/api/manage-users/communication/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch communication')
        
        const data = await response.json()
        setCommunication(data)
      } catch (err) {
        setError('Failed to load communication')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCommunication()
  }, [params.id])

  const handleStatusUpdate = async (status: string) => {
    if (!communication) return
    
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/manage-users/communication/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: communication.type,
          status
        })
      })

      if (!response.ok) throw new Error('Failed to update status')
      
      setCommunication(prev => prev ? {
        ...prev,
        data: { ...prev.data, status }
      } : null)
    } catch (err) {
      console.error(err)
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) return <LoadingPlaceholder />
  if (error) return <ErrorDisplay error={error} />
  if (!communication) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <div className="flex items-center gap-2">
            {communication.type === 'CONTACT' ? (
              <EnvelopeIcon className="h-5 w-5 text-blue-500" />
            ) : (
              <FlagIcon className="h-5 w-5 text-red-500" />
            )}
            <span className="font-medium">
              {communication.type === 'CONTACT' ? 'Contact' : 'Report'}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* User Info */}
          <div className="flex items-start gap-4 mb-6">
            {communication.data.user.image ? (
              <img
                src={communication.data.user.image}
                alt=""
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-900">
                {communication.data.user.name}
              </h3>
              <p className="text-sm text-gray-500">
                {communication.data.user.email}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  Joined {new Date(communication.data.user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-4 mb-6">
            <span className={cn(
              "px-2.5 py-0.5 rounded-full text-sm font-medium",
              communication.data.status === 'PENDING' ? "bg-yellow-100 text-yellow-800" :
              communication.data.status === 'RESOLVED' ? "bg-green-100 text-green-800" :
              "bg-red-100 text-red-800"
            )}>
              {communication.data.status}
            </span>
            
            {communication.data.status === 'PENDING' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusUpdate('RESOLVED')}
                  disabled={isUpdating}
                  className="inline-flex items-center px-3 py-1 rounded-md bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-50"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Resolve
                </button>
                <button
                  onClick={() => handleStatusUpdate('SPAM')}
                  disabled={isUpdating}
                  className="inline-flex items-center px-3 py-1 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50"
                >
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Mark as Spam
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          {communication.type === 'REPORT' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900">
                <LinkIcon className="h-5 w-5" />
                <a 
                  href={`/article/${communication.data.post?.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline"
                >
                  {communication.data.post?.title}
                </a>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Reason</h4>
                <p className="text-gray-700">{communication.data.reason}</p>
              </div>
              {communication.data.details && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Additional Details</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{communication.data.details}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Subject</h4>
                <p className="text-gray-700">{communication.data.subject}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Message</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{communication.data.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LoadingPlaceholder() {
  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
          <div className="h-8 w-2/3 bg-gray-200 rounded" />
          
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-48 bg-gray-200 rounded" />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ErrorDisplay({ error }: { error: string }) {
  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="rounded-lg bg-red-50 p-6">
          <div className="flex items-center">
            <ExclamationCircleIcon className="h-8 w-8 text-red-400" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800">Error Loading Message</h3>
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
    </div>
  )
}