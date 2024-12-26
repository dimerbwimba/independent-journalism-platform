import Link from 'next/link'
import { BookOpenIcon } from '@heroicons/react/24/outline'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Article Not Found | Travel Wing Blog',
  description: 'Sorry, we couldn\'t find the article you\'re looking for. Browse our latest travel articles and guides.',
  robots: 'noindex',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/article/not-found`
  }
}

export default function ArticleNotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4" role="main">
      <div className="text-center">
        <BookOpenIcon className="mx-auto h-16 w-16 text-gray-400" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Article Not Found</h1>
        <p className="mt-2 text-gray-600 max-w-md mx-auto">
          The article you&apos;re looking for doesn&apos;t exist or has been removed. Try browsing our latest articles instead.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Return to homepage"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}