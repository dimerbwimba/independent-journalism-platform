'use client'

import { Suspense } from 'react'
import Link from 'next/link'

function NotFoundContent() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Page not found</h2>
        <p className="mt-2 text-gray-600">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
}

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  )
} 