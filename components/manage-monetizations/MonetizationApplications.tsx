'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { MonetizationStatus } from '@prisma/client'

interface Application {
  id: string
  status: MonetizationStatus
  paypalEmail: string | null
  totalEarnings: number
  pendingPayout: number
  appliedAt: Date
  user: {
    name: string | null
    email: string | null
    image: string | null
  }
}

interface Props {
  applications: Application[]
}

export default function MonetizationApplications({ applications }: Props) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsProcessing(true)
    setSelectedId(id)
    
    try {
      const response = await fetch('/api/monetization/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      })

      if (!response.ok) throw new Error('Failed to update status')

      window.location.reload()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    } finally {
      setIsProcessing(false)
      setSelectedId(null)
    }
  }

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="sm:flex sm:items-center p-6 border-b">
        <div className="sm:flex-auto">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Applications
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Review and manage monetization applications from content creators
          </p>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {applications.map((app) => (
          <div key={app.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {app.user.image && (
                  <Image
                    src={app.user.image}
                    alt={app.user.name || ''}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {app.user.name}
                  </h4>
                  <p className="text-sm text-gray-500">{app.user.email}</p>
                </div>
              </div>
              <div className={`
                px-3 py-1 rounded-full text-xs font-medium
                ${app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  app.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'}
              `}>
                {app.status.toLowerCase()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">PayPal Email</p>
                <p className="text-sm font-medium text-gray-900">{app.paypalEmail}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Earnings</p>
                <p className="text-sm font-medium text-gray-900">
                  ${app.totalEarnings.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Applied On</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {app.status === 'PENDING' && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleUpdateStatus(app.id, 'APPROVED')}
                  disabled={isProcessing && selectedId === app.id}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                  Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                  disabled={isProcessing && selectedId === app.id}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  <XCircleIcon className="h-4 w-4 mr-1.5" />
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}

        {applications.length === 0 && (
          <div className="text-center py-12">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Applications</h3>
            <p className="mt-1 text-sm text-gray-500">
              No pending monetization applications at the moment
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 