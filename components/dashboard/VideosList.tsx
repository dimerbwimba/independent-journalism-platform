'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  VideoCameraIcon,
  PlayIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

interface Video {
  id: string
  title: string
  description?: string
  videoUrl: string
  thumbnail?: string
  duration?: string
  published: boolean
  createdAt: string
  authorName?: string
  authorEmail?: string
}

export default function VideosList() {
  const router = useRouter()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const endpoint = isAdmin ? '/api/videos/all' : '/api/videos'
      const response = await fetch(endpoint)
      if (!response.ok) throw new Error('Failed to fetch videos')
      
      const data = await response.json()
      setVideos(data.videos)
    } catch (err) {
      setError('Failed to load videos')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (videoId: string) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return

    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete video')
      
      setVideos(videos.filter(video => video.id !== videoId))
      router.refresh()
    } catch (err) {
      console.error(err)
      setError('Failed to delete video')
    }
  }

  const handleApprove = async (videoId: string) => {
    try {
      const response = await fetch(`/api/videos/${videoId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ approved: true })
      })

      if (!response.ok) throw new Error('Failed to approve video')
      
      setVideos(videos.map(video => 
        video.id === videoId ? { ...video, published: true } : video
      ))
      router.refresh()
    } catch (err) {
      console.error(err)
      setError('Failed to approve video')
    }
  }

  const handleReject = async (videoId: string) => {
    if (!window.confirm('Are you sure you want to reject this video?')) return

    try {
      const response = await fetch(`/api/videos/${videoId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ approved: false })
      })

      if (!response.ok) throw new Error('Failed to reject video')
      
      setVideos(videos.map(video => 
        video.id === videoId ? { ...video, published: false } : video
      ))
      router.refresh()
    } catch (err) {
      console.error(err)
      setError('Failed to reject video')
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="bg-white rounded-lg shadow animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center bg-white rounded-lg shadow px-4 py-12">
        <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No videos</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new video.</p>
        <div className="mt-6">
          <Link
            href="/dashboard/videos/create"
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <VideoCameraIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
            Add Video
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {videos.map((video, index) => (
        <div
          key={video.id}
          className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          <div className="relative h-48 bg-gray-100 group">
            {video.thumbnail ? (
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                priority={index === 0}
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <VideoCameraIcon className="h-12 w-12 text-gray-300" />
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
              <PlayIcon className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute top-2 right-2">
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                video.published 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {video.published ? 'Published' : 'Draft'}
              </span>
            </div>
            {video.duration && (
              <div className="absolute bottom-2 right-2">
                <span className="inline-flex items-center rounded-md bg-black bg-opacity-75 px-2 py-1 text-xs font-medium text-white">
                  {video.duration}
                </span>
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {video.title}
            </h3>
            
            {video.description && (
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {video.description}
              </p>
            )}

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>{new Date(video.createdAt).toLocaleDateString()}</span>
              {isAdmin && video.authorName && (
                <span className="text-sm text-gray-500">
                  By {video.authorName}
                </span>
              )}
            </div>

            <div className="mt-4  grid grid-cols-2 items-center justify-end gap-2">
              {isAdmin && !video.published && (
                <>
                  <button
                    onClick={() => handleApprove(video.id)}
                    className="inline-flex items-center rounded-md bg-green-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(video.id)}
                    className="inline-flex items-center rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                  >
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    Reject
                  </button>
                </>
              )}
              <Link
                href={`/dashboard/videos/${video.id}/preview`}
                className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                View
              </Link>
              <Link
                href={`/dashboard/videos/${video.id}/edit`}
                className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit
              </Link>
              <button
                onClick={() => handleDelete(video.id)}
                className="inline-flex items-center rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 