import Link from 'next/link'
import { MapPinIcon } from '@heroicons/react/24/outline'

export default function LocationNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <MapPinIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Location not found</h2>
        <p className="mt-2 text-gray-600">
          Sorry, we couldn&apos;t find the location you&apos;re looking for.
        </p>
        <Link
          href="/travel-accomodation/hotels"
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          View All Locations
        </Link>
      </div>
    </div>
  )
} 