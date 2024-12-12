'use client'

import { useEffect, useState } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  createdAt: string
}

export default function CategoryList() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setError(null)
      const response = await fetch('/api/categories')
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      setError('Failed to load categories. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this category? This will remove the category from all associated posts.')) {
      return
    }

    try {
      setDeleteLoading(categoryId)
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete category')
      }

      setCategories(categories.filter(category => category.id !== categoryId))
      router.refresh()
    } catch (error) {
      console.error('Failed to delete category:', error)
      alert('Failed to delete category. Please try again.')
    } finally {
      setDeleteLoading(null)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-3 mt-4">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
        <div className="text-center">
          <div className="text-red-600 mb-2">Error</div>
          <p className="text-gray-500">{error}</p>
          <button
            onClick={fetchCategories}
            className="mt-4 text-blue-600 hover:text-blue-500"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8">
        <div className="text-center">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No categories</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new category.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
      <ul role="list" className="divide-y divide-gray-100">
        {categories.map((category) => (
          <li 
            key={category.id} 
            className="relative flex items-center justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6"
          >
            <div className="min-w-0">
              <div className="flex items-start gap-x-3">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  {category.name}
                </p>
                <p className="rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset text-gray-600 bg-gray-50 ring-gray-500/10">
                  {category.slug}
                </p>
              </div>
              {category.description && (
                <p className="mt-1 text-sm leading-5 text-gray-500">
                  {category.description}
                </p>
              )}
              <p className="mt-1 text-xs leading-5 text-gray-400">
                Created on {new Date(category.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-none items-center gap-x-4">
              <button
                onClick={() => handleDelete(category.id)}
                disabled={deleteLoading === category.id}
                className={`rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${
                  deleteLoading === category.id && 'animate-pulse'
                }`}
              >
                <TrashIcon className="h-4 w-4 text-gray-500" />
                <span className="sr-only">Delete category</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
} 