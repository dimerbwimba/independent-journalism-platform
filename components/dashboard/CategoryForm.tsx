'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Category {
  id?: string
  name: string
  slug: string
  description?: string
  image?: string
}

interface CategoryFormProps {
  category?: Category
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isImageValid, setIsImageValid] = useState(true)

  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    image: category?.image || '',
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    })
  }

  const validateImageUrl = (url: string) => {
    if (!url) {
      setIsImageValid(true)
      setError(null)
      return true
    }

    try {
      new URL(url)
      const isImageUrl = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url)
      setIsImageValid(isImageUrl)
      
      if (!isImageUrl) {
        setError('URL should end with an image extension (jpg, jpeg, png, webp, gif, svg)')
      } else {
        setError(null)
      }

      return isImageUrl
    } catch {
      setIsImageValid(false)
      setError('Please enter a valid URL')
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!formData.image) {
      setError('Image is required')
      return
    }

    if (!isImageValid) {
      setError('Please provide a valid image URL')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(
        category ? `/api/categories/${category.id}` : '/api/categories',
        {
          method: category ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      )

      if (response.ok) {
        router.push('/dashboard/categories')
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || 'Something went wrong')
      }
    } catch (error:any) {
      setError('Failed to save category or contact support. '+error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleNameChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
          Slug
        </label>
        <input
          type="text"
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 bg-gray-50"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input
          type="url"
          id="image"
          value={formData.image}
          onChange={(e) => {
            const url = e.target.value
            setFormData({ ...formData, image: url })
            validateImageUrl(url)
          }}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          required
        />
        {formData.image && isImageValid && (
          <div className="mt-2">
            <Image
              src={formData.image}
              alt="Category preview"
              width={200}
              height={200}
              className="rounded-lg object-cover"
              onError={() => {
                setIsImageValid(false)
                setError('Failed to load image. Please check the URL.')
              }}
            />
          </div>
        )}
      </div>

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
          disabled={isLoading || !isImageValid}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : (category ? 'Update Category' : 'Create Category')}
        </button>
      </div>
    </form>
  )
} 