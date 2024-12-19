'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  BookmarkIcon, 
  TrashIcon, 
  ExclamationCircleIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline'

interface SavedArticle {
  id: string
  post: {
    id: string
    title: string
    description: string
    slug: string
    image: string | null
    createdAt: string
    author: {
      name: string
      image: string | null
    }
  }
  createdAt: string
}

export default function SavedArticlesPage() {
  const { data: session } = useSession()
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSavedArticles = async () => {
      try {
        const response = await fetch('/api/articles/saved')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch saved articles')
        }

        setSavedArticles(data.savedArticles)
      } catch (err) {
        console.error('Error fetching saved articles:', err)
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchSavedArticles()
    }
  }, [session])

  const handleUnsave = async (postId: string) => {
    try {
      const response = await fetch(`/api/articles/action/${postId}/save`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to unsave article')
      }

      setSavedArticles(prev => prev.filter(article => article.post.id !== postId))
    } catch (error) {
      console.error('Error unsaving article:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            </div>
            
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start space-x-4 p-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="flex-1">
                    <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-3" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <ExclamationCircleIcon className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Error Loading Saved Articles</h3>
              <p className="mt-1 text-sm text-gray-500">{error}</p>
              <div className="mt-6">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Saved Articles</h1>
              <p className="mt-1 text-sm text-gray-500">
                {savedArticles.length} {savedArticles.length === 1 ? 'article' : 'articles'} saved
              </p>
            </div>
          </div>
          
          {savedArticles.length === 0 ? (
            <div className="text-center py-16 px-4">
              <BookmarkIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No saved articles yet</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                Save interesting articles to read them later or keep them for reference.
              </p>
              <div className="mt-8">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse Articles
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6 divide-y divide-gray-100">
              {savedArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-start space-x-4 pt-6 first:pt-0"
                >
                  {article.post.image ? (
                    <div className="flex-shrink-0">
                      <Image
                        src={article.post.image}
                        alt=""
                        width={100}
                        height={100}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-[100px] h-[100px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <BookmarkIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/article/${article.post.slug}`}
                      className="block group"
                    >
                      <h2 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {article.post.title}
                      </h2>
                    </Link>
                    {article.post.description && (
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {article.post.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        Saved {new Date(article.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <button
                        onClick={() => handleUnsave(article.post.id)}
                        className="text-sm text-red-600 hover:text-red-500 flex items-center space-x-1 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 