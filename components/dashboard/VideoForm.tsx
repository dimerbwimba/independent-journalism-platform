'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import VideoPreview from './VideoPreview'
import { useSession } from 'next-auth/react'

interface Video {
  id?: string
  title: string
  seoTitle?: string
  description?: string
  videoUrl: string
  thumbnail?: string
  duration?: string
  published?: boolean
  postId?: string
}

interface VideoFormProps {
  video?: Video
  posts?: { 
    id: string
    title: string  // Now includes author name
  }[]
}

export default function VideoForm({ video, posts }: VideoFormProps) {
  const router = useRouter()
  const session = useSession()
  const isAdmin = session.data?.user?.role === 'admin'
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const [formData, setFormData] = useState({
    title: video?.title || '',
    seoTitle: video?.seoTitle || '',
    description: video?.description || '',
    videoUrl: video?.videoUrl || '',
    thumbnail: video?.thumbnail || '',
    duration: video?.duration || '',
    published: video?.published || false,
    postId: video?.postId || '',
  })

  const validateVideoUrl = (url: string) => {
    const videoPatterns = {
      youtube: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
      vimeo: /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+$/,
    }

    return (
      videoPatterns.youtube.test(url) ||
      videoPatterns.vimeo.test(url)
    )
  }

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setFormData({ ...formData, videoUrl: url })
    setShowPreview(validateVideoUrl(url))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!validateVideoUrl(formData.videoUrl)) {
      setError('Please enter a valid video URL from YouTube or Vimeo')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(
        video ? `/api/videos/${video.id}` : '/api/videos',
        {
          method: video ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      )

      if (response.ok) {
        router.push('/dashboard/videos')
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Failed to save video')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700">
          SEO Title
        </label>
        <input
          type="text"
          id="seoTitle"
          value={formData.seoTitle}
          onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          {formData.seoTitle.length}/60 characters recommended
        </p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          {formData.description?.length || 0}/160 characters recommended
        </p>
      </div>

      <div>
        <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">
          Video URL
        </label>
        <input
          type="url"
          id="videoUrl"
          value={formData.videoUrl}
          onChange={handleVideoUrlChange}
          placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          required
        />
        {showPreview && formData.videoUrl && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video Preview
            </label>
            <div className="w-full max-w-3xl rounded-lg overflow-hidden border border-gray-200">
              <VideoPreview url={formData.videoUrl} />
            </div>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
          Thumbnail URL
        </label>
        <input
          type="url"
          id="thumbnail"
          value={formData.thumbnail}
          onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {formData.thumbnail && (
          <div className="mt-2">
            <Image
              src={formData.thumbnail}
              alt="Thumbnail preview"
              width={200}
              height={112}
              className="rounded-md"
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Duration
        </label>
        <input
          type="text"
          id="duration"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          placeholder="e.g., 10:30"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>

      {posts && posts.length > 0 && (
        <div>
          <label htmlFor="postId" className="block text-sm font-medium text-gray-700">
            Link to Article
          </label>
          <select
            id="postId"
            value={formData.postId}
            onChange={(e) => setFormData({ ...formData, postId: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">Select an article</option>
            {posts.map((post) => (
              <option key={post.id} value={post.id}>
                {post.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {isAdmin && <div className="flex items-center">
        <input
          id="published"
          type="checkbox"
          checked={formData.published}
          onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
          Publish video
        </label>
      </div>}

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : (video ? 'Update Video' : 'Create Video')}
        </button>
      </div>
    </form>
  )
} 