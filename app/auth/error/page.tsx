import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold text-red-600">Authentication Error</h1>
          <p className="mt-2 text-gray-600">
            There was a problem signing you in.
          </p>
        </div>
        <div className="mt-4">
          <Link
            href="/auth/signin"
            className="text-blue-600 hover:text-blue-500"
          >
            Try again
          </Link>
        </div>
      </div>
    </div>
  )
} 