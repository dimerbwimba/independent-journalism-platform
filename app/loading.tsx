'use client'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4" role="status" aria-label="Loading content">
      <div className="flex flex-col items-center space-y-6">
        {/* Pulse animation container */}
        <div className="relative">
          <div className="h-16 w-16">
            {/* Multiple rings with different animations */}
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 opacity-20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-l-blue-300 animate-pulse"></div>
          </div>
        </div>
        
        {/* Loading text with shimmer effect */}
        <div className="relative">
          <span className="text-lg font-medium text-gray-700 bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent animate-pulse">
            Loading...
          </span>
        </div>
      </div>
    </div>
  )
}
