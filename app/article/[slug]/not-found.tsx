import Link from 'next/link'
import { BookOpenIcon } from '@heroicons/react/24/outline'

export default function ArticleNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <BookOpenIcon className="mx-auto h-16 w-16 text-gray-400" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Article Not Found</h2>
        <p className="mt-2 text-gray-600 max-w-md mx-auto">
          The article you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
} 