import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Category Not Found | Your Site Name',
  description: 'Sorry, we couldn\'t find the category you\'re looking for. Browse all available categories.',
  robots: 'noindex',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/article/not-found`
  }
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center" role="main">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Category not found</h1>
        <p className="mt-4 text-gray-600">
          Sorry, we couldn&apos;t find the category you&apos;re looking for.
        </p>
        <Link
          href="/categories"
          className="mt-8 inline-flex items-center rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="View all categories"
        >
          View All Categories
        </Link>
      </div>
    </main>
  )
}