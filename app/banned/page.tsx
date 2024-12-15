import Link from 'next/link'
import { 
  ShieldExclamationIcon, 
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function BannedPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center">
          <ShieldExclamationIcon className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Account Suspended</h2>
          <p className="mt-2 text-lg text-gray-600">
            Your account has been suspended due to violations of our community guidelines.
          </p>
        </div>

        <div className="mt-10 space-y-8">
          {/* Contact Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <EnvelopeIcon className="h-5 w-5 text-gray-500" />
              Contact Us
            </h3>
            <p className="mt-2 text-gray-600">
              To appeal this decision or discuss your account status, please contact us at:
            </p>
            <a 
              href="mailto:next191996@gmail.com"
              className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-500"
            >
              next191996@gmail.com
            </a>
            <p className="mt-4 text-sm text-gray-500">
              Please include your account email and any relevant information in your appeal.
            </p>
          </div>

          {/* What This Means */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />
              What This Means
            </h3>
            <ul className="mt-4 space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="rounded-full h-5 w-5 flex items-center justify-center bg-red-100 text-red-600 flex-shrink-0">
                  ✕
                </span>
                <span>You cannot create or edit content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="rounded-full h-5 w-5 flex items-center justify-center bg-red-100 text-red-600 flex-shrink-0">
                  ✕
                </span>
                <span>You cannot access your dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="rounded-full h-5 w-5 flex items-center justify-center bg-green-100 text-green-600 flex-shrink-0">
                  ✓
                </span>
                <span>You can still view public content</span>
              </li>
            </ul>
          </div>

          {/* Appeal Process */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-gray-500" />
              Appeal Process
            </h3>
            <div className="mt-4 space-y-4 text-gray-600">
              <p>
                Appeals are typically reviewed within 2-3 business days. To expedite your appeal:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide a clear explanation of why you believe the ban should be lifted</li>
                <li>Include any relevant evidence or context</li>
                <li>Be honest and respectful in your communication</li>
              </ul>
            </div>
          </div>

          {/* Alternative Contact */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-500" />
              Alternative Contact Methods
            </h3>
            <div className="mt-4 space-y-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-500"
          >
            Return to Home Page
          </Link>
        </div>
      </div>
    </div>
  )
} 