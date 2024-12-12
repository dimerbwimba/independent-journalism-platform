'use client'

import { useState } from 'react'
import { EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

interface NewsletterFormProps {
  variant?: 'default' | 'inline'
}

export default function NewsletterForm({ variant = 'default' }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/contact/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to subscribe')
      }

      setSuccess(true)
      setEmail('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (variant === 'inline') {
    if (success) {
      return (
        <div className="my-8 bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-2">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <p className="text-sm font-medium text-green-800">
              Thanks for subscribing!
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="my-8 border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white rounded-r-lg p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-semibold text-gray-900">
              Enjoying this article?
            </h4>
            <p className="mt-1 text-sm text-gray-500">
              Get more like this delivered to your inbox.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full sm:w-auto">
            <div className="flex gap-x-2">
              <div className="relative flex-grow">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <EnvelopeIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-lg border-0 py-2 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm"
                  placeholder="Enter your email"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-none rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '...' : 'Subscribe'}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-xs text-red-600">{error}</p>
            )}
          </form>
        </div>
      </div>
    )
  }

  // Default variant (end of article)
  if (success) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
        <div className="flex items-center justify-center space-x-3 text-center">
          <CheckCircleIcon className="h-6 w-6 text-green-500" />
          <p className="text-sm font-medium text-gray-900">
            Thanks for subscribing! Check your inbox soon.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
      <div className="absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
      
      <div className="relative p-8">
        <div className="flex flex-col items-center text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Get the latest articles and insights delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="flex gap-x-2">
              <div className="relative flex-grow">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-lg border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-none rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
            )}
          </form>

          <p className="mt-3 text-xs text-gray-500 flex items-center gap-x-1">
            <span className="inline-block w-1 h-1 rounded-full bg-gray-500" />
            No spam, unsubscribe at any time
          </p>
        </div>
      </div>
    </div>
  )
} 