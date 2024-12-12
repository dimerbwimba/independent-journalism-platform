'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  EyeIcon, 
  HeartIcon, 
  ChatBubbleLeftIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface Activity {
  slug: string
  title: string
  createdAt: string
  _count: {
    views: number
    reactions: number
    comments: number
  }
}

function LoadingPlaceholder() {
  return (
    <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="p-6 animate-pulse">
          {/* Title placeholder */}
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-4" />
          
          {/* Metrics row placeholder */}
          <div className="flex items-center gap-4">
            {/* Views placeholder */}
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
            
            {/* Reactions placeholder */}
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
            
            {/* Comments placeholder */}
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
            
            {/* Date placeholder */}
            <div className="h-4 bg-gray-200 rounded w-24 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/analytics/user/activity')
      if (!response.ok) throw new Error('Failed to fetch activities')
      
      const data = await response.json()
      setActivities(data.recentEngagement)
    } catch (err) {
      setError('Failed to load activities')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <ClockIcon className="w-12 h-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error Loading Activities</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="divide-y divide-gray-100">
        {activities.map((activity) => (
          <div key={activity.slug} className="p-6 hover:bg-gray-50 transition-colors">
            <Link 
              href={`/article/${activity.slug}`}
              className="block"
            >
              <div className="flex flex-col">
                <h4 className="font-medium text-gray-900 mb-2">{activity.title}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <EyeIcon className="h-4 w-4" />
                    {activity._count.views.toLocaleString()} views
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HeartIcon className="h-4 w-4" />
                    {activity._count.reactions.toLocaleString()} reactions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ChatBubbleLeftIcon className="h-4 w-4" />
                    {activity._count.comments.toLocaleString()} comments
                  </span>
                  <span className="text-gray-400">
                    {new Date(activity.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-12">
            <ClockIcon className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Recent Activity</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start creating content to see your activity here
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 