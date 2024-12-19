'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  TagIcon,
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
  ChartBarIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { redirect } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  postCount: number
  createdAt: string
}

interface CategoryStats {
  totalCategories: number
  topCategories: {
    name: string
    postCount: number
    percentage: number
  }[]
  uncategorizedPosts: number
}

export default function CategoriesPage() {
  const { data: session } = useSession()
  const [categories, setCategories] = useState<Category[]>([])
  const [stats, setStats] = useState<CategoryStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState({ 
    name: '', 
    slug: '', 
    description: '', 
    image: '' 
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if(session?.user?.role !== 'admin') {
    redirect('/dashboard/posts')
  }

  useEffect(() => {
    fetchCategories()
    fetchStats()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      setError('Failed to load categories')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/categories/stats')
      if (!response.ok) throw new Error('Failed to fetch category stats')
      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error('Failed to load category stats:', err)
    }
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      })

      if (!response.ok) throw new Error('Failed to create category')

      const data = await response.json()
      setCategories([...categories, data])
      setShowCreateModal(false)
      setNewCategory({ name: '', slug: '', description: '', image: '' })
      await fetchStats() // Refresh stats
    } catch (err) {
      console.error('Error creating category:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete category')

      setCategories(categories.filter(cat => cat.id !== categoryId))
      setShowDeleteModal(null)
      await fetchStats() // Refresh stats
    } catch (err) {
      console.error('Error deleting category:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }

  if (isLoading) return <LoadingPlaceholder />
  if (error) return <ErrorDisplay error={error} />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage post categories and organization
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Category
        </button>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TagIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Categories
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalCategories}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Uncategorized Posts
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.uncategorizedPosts}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Most Used Category
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.topCategories[0]?.name || 'None'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {categories.map((category) => (
            <li key={category.id}>
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 flex items-center gap-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {category.postCount} posts
                      </span>
                      <button
                        onClick={() => setShowDeleteModal(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Create New Category
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCategory}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newCategory.name}
                    onChange={(e) => {
                      const name = e.target.value
                      setNewCategory({ 
                        ...newCategory, 
                        name,
                        slug: generateSlug(name)
                      })
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                    Slug *
                  </label>
                  <input
                    type="text"
                    id="slug"
                    value={newCategory.slug}
                    onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    pattern="[a-z0-9-]+"
                    title="Lowercase letters, numbers, and hyphens only"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    URL-friendly version of the name. Auto-generated but can be customized.
                  </p>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="image"
                    value={newCategory.image}
                    onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  {newCategory.image && (
                    <div className="mt-2">
                      <Image
                        src={newCategory.image}
                        alt="Category preview"
                        width={100}
                        height={100}
                        className="rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.jpg'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newCategory.name || !newCategory.slug}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-medium text-gray-900">
                Delete Category
              </h3>
            </div>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCategory(showDeleteModal)}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Deleting...' : 'Delete Category'}
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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-5">
            <div className="h-6 w-6 bg-gray-200 rounded mb-4" />
            <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-3 flex-1">
                <div className="h-5 w-1/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
              </div>
              <div className="h-8 w-20 bg-gray-200 rounded" />
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