import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Category not found</h2>
        <p className="mt-4 text-gray-600">
          Sorry, we couldn&apos;t find the category you&apos;re looking for.
        </p>
        <Link
          href="/categories"
          className="mt-8 inline-flex items-center rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          View All Categories
        </Link>
      </div>
    </div>
  )
} 