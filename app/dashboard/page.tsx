'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import UserAnalytics from "@/components/dashboard/UserAnalytics"
import MonetizationProgress from "@/components/dashboard/MonetizationProgress"
import { BanknotesIcon } from '@heroicons/react/24/outline'

interface MonetizationStatus {
  isMonetized: boolean
  totalViews: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [monetizationData, setMonetizationData] = useState<MonetizationStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) return

    const fetchMonetizationStatus = async () => {
      try {
        const response = await fetch('/api/monetization/check-progress')
        if (!response.ok) throw new Error('Failed to fetch monetization status')
        
        const data = await response.json()
        setMonetizationData(data)
      } catch (err) {
        setError('Failed to load monetization status')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMonetizationStatus()
  }, [session])

  if (status === 'loading') {
    return <LoadingPlaceholder />
  }

  if (!session) {
    redirect('/auth/signin')
  }

  if (isLoading) {
    return <LoadingPlaceholder />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="rounded-full bg-red-100 p-3 mx-auto w-fit">
          <BanknotesIcon className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error Loading Data</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {monetizationData?.isMonetized ? 'Creator Analytics' : 'Creator Dashboard'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {monetizationData?.isMonetized 
              ? 'Overview of your content performance'
              : 'Track your progress towards monetization'}
          </p>
        </div>
      </div>

      {monetizationData?.isMonetized ? (
        <UserAnalytics />
      ) : (
        <MonetizationProgress totalViews={monetizationData?.totalViews || 0} />
      )}
    </div>
  )
}

function LoadingPlaceholder() {
  return (
    <div className="space-y-6 animate-pulse p-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="h-8 w-60 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-40 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <div className="h-4 w-1/4 bg-gray-200 rounded" />
        <div className="space-y-3">
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="h-20 bg-gray-200 rounded" />
          <div className="h-20 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )
} 