'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface ContactResponse {
  id: string
  body: string
  createdAt: string
  user: {
    name: string
    image: string | null
  }
}

interface Contact {
  id: string
  subject: string
  message: string
  status: 'PENDING' | 'RESOLVED' | 'SPAM'
  createdAt: string
  responses: ContactResponse[]
}

export default function InquiriesPage() {
  // const { data: session } = useSession()
  const [inquiries, setInquiries] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await fetch('/api/user/inquiries')
        if (!response.ok) throw new Error('Failed to fetch inquiries')
        
        const data = await response.json()
        setInquiries(data.inquiries)
      } catch (err) {
        setError('Failed to load inquiries')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInquiries()
  }, [])

  if (isLoading) return <LoadingPlaceholder />
  if (error) return <ErrorDisplay error={error} />

  return (
    <div className="space-y-6 p-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            My Inquiries
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View and track your support inquiries and responses
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {inquiries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No inquiries yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get help by sending us a message
            </p>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                Contact Support
              </Link>
            </div>
          </div>
        ) : (
          inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {inquiry.subject}
                      </h3>
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-xs font-medium",
                        inquiry.status === 'PENDING' ? "bg-yellow-100 text-yellow-800" :
                        inquiry.status === 'RESOLVED' ? "bg-green-100 text-green-800" :
                        "bg-red-100 text-red-800"
                      )}>
                        {inquiry.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {inquiry.message}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Responses Section */}
                {inquiry.responses.length > 0 && (
                  <div className="mt-6 border-t border-gray-100 pt-6 space-y-4">
                    {inquiry.responses.map((response) => (
                      <div key={response.id} className="flex gap-4">
                        <div className="flex-shrink-0">
                          {response.user.image ? (
                            <img
                              src={response.user.image}
                              alt=""
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">
                                {response.user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">
                              {response.user.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(response.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            {response.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function LoadingPlaceholder() {
  return (
    <div className="space-y-6 p-8">
      <div className="h-10 w-1/4 bg-gray-200 rounded animate-pulse" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
            <div className="space-y-3">
              <div className="h-6 w-1/3 bg-gray-200 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ErrorDisplay({ error }: { error: string }) {
  return (
    <div className="rounded-lg bg-red-50 p-6">
      <div className="flex items-center">
        <XMarkIcon className="h-8 w-8 text-red-400" />
        <div className="ml-4">
          <h3 className="text-lg font-medium text-red-800">Error Loading Inquiries</h3>
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
  )
} 