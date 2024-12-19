'use client'

import { useState } from 'react'
import { BookmarkIcon } from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface SaveArticleButtonProps {
  postId: string
  initialSaved?: boolean
}

export default function SaveArticleButton({ postId, initialSaved }: SaveArticleButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const handleSave = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`/api/articles/action/${postId}/save`, {
        method: isSaved ? 'DELETE' : 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to save article')
      }

      setIsSaved(!isSaved)
    } catch (error) {
      console.error('Error saving article:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSave}
      disabled={isLoading}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
        isSaved 
          ? ' text-blue-600 ' 
          : ' text-gray-700'
      }`}
      aria-label={isSaved ? 'Unsave Article' : 'Save Article'}
    >
      {isSaved ? (
        <BookmarkSolidIcon className="h-5 w-5" />
      ) : (
        <BookmarkIcon className="h-5 w-5" />
      )}
      <span>{isSaved ? 'Saved' : 'Save'}</span>
    </button>
  )
} 