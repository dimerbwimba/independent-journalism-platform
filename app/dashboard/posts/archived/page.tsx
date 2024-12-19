'use client'

import { useState, useEffect } from 'react'
import { 
  TrashIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

interface ArchivedPost {
  id: string
  title: string
  description?: string
  createdAt: string
  rejectedAt: string
  author: {
    name: string
    email: string
  }
  reason?: string
}

export default function ArchivedPostsPage() {
  const [posts, setPosts] = useState<ArchivedPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchArchivedPosts()
  }, [])

  const fetchArchivedPosts = async () => {
    try {
      const response = await fetch('/api/posts/archived')
      if (!response.ok) throw new Error('Failed to fetch archived posts')
      const data = await response.json()
      setPosts(data.posts)
    } catch (err) {
      setError('Failed to load archived posts')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(posts.map(post => post.id))
    }
  }

  const handleSelectPost = (postId: string) => {
    if (selectedPosts.includes(postId)) {
      setSelectedPosts(selectedPosts.filter(id => id !== postId))
    } else {
      setSelectedPosts([...selectedPosts, postId])
    }
  }

  const handleDelete = async (postIds: string[]) => {
    try {
      setIsDeleting(true)
      const response = await fetch('/api/posts/archived/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postIds })
      })

      if (!response.ok) throw new Error('Failed to delete posts')

      // Remove deleted posts from state
      setPosts(posts.filter(post => !postIds.includes(post.id)))
      setSelectedPosts([])
      setShowConfirmModal(false)
    } catch (err) {
      console.error('Error deleting posts:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) return <LoadingPlaceholder />
  if (error) return <ErrorDisplay error={error} />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Archived Posts</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage rejected and archived posts
        </p>
      </div>

      {/* Actions Bar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={selectedPosts.length === posts.length}
            onChange={handleSelectAll}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">
            {selectedPosts.length} selected
          </span>
        </div>
        {selectedPosts.length > 0 && (
          <button
            onClick={() => setShowConfirmModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete Selected
          </button>
        )}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <ArchiveBoxIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No archived posts</h3>
            <p className="mt-1 text-sm text-gray-500">
              Rejected posts will appear here
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedPosts.includes(post.id)}
                  onChange={() => handleSelectPost(post.id)}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{post.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{post.description}</p>
                    </div>
                    <button
                      onClick={() => handleDelete([post.id])}
                      className="text-red-600 hover:text-red-500"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Rejected on: {new Date(post.rejectedAt).toLocaleDateString()}</p>
                    {post.reason && <p className="mt-1">Reason: {post.reason}</p>}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-medium text-gray-900">
                Confirm Deletion
              </h3>
            </div>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete {selectedPosts.length} selected posts? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedPosts)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Posts'}
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="h-4 w-4 bg-gray-200 rounded" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ErrorDisplay({ error }: { error: string }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex">
          <XMarkIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 