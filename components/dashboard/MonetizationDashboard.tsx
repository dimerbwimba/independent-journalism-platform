'use client'

import { useState } from 'react'
import { 
  BanknotesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface MonetizationProfile {
  status: string
  paypalEmail: string | null
  fullName: string | null
  dateOfBirth: Date | null
  whatsappNumber: string | null
  location: string | null
  country: string | null
  totalEarnings: number
  pendingPayout: number
  lastPayout: Date | null
  appliedAt: Date | null
  rejectedAt?: Date | null
  payouts: Array<{
    amount: number
    status: string
    createdAt: Date
  }>
}

interface Props {
  profile: MonetizationProfile | null
  totalViews: number
}

export default function MonetizationDashboard({ profile, totalViews }: Props) {
  const [isApplying, setIsApplying] = useState(false)
  const [_, setShowReapplyModal] = useState(false)
  const [formData, setFormData] = useState({
    paypalEmail: '',
    fullName: '',
    dateOfBirth: '',
    whatsappNumber: '',
    location: '',
    country: '',
  })
  const [error, setError] = useState<string | null>(null)

  const isEligible = totalViews >= 10000
  const earningsPerThousand = 0.3
  const countedViews = Math.floor(totalViews * 0.65)
  const estimatedEarnings = (countedViews / 1000) * earningsPerThousand

  const canReapply = profile?.rejectedAt 
    ? new Date().getTime() - new Date(profile.rejectedAt).getTime() > 30 * 24 * 60 * 60 * 1000 
    : true;

  const daysUntilReapply = profile?.rejectedAt 
    ? Math.max(0, 30 - Math.floor((new Date().getTime() - new Date(profile.rejectedAt).getTime()) / (24 * 60 * 60 * 1000)))
    : 0;

  const handleApply = async () => {
    if (!formData.paypalEmail) {
      setError('PayPal email is required')
      return
    }

    setIsApplying(true)
    try {
      const response = await fetch('/api/monetization/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to apply')

      window.location.reload()
    } catch (error:any) {
      setError('Failed to submit application or contact support. '+error.message)
    } finally {
      setIsApplying(false)
    }
  }

  if (!isEligible) {
    const progressPercentage = (totalViews / 10000) * 100
    const remainingViews = 10000 - totalViews

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          <div className="text-center">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Not Eligible Yet</h3>
            <p className="mt-1 text-sm text-gray-600">
              You need at least 10,000 views to be eligible for monetization
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-gray-700">Progress to Eligibility</span>
                  <span className="text-blue-600">{progressPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-100">
                  <p className="text-sm text-gray-500">Current Views</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {totalViews.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-100">
                  <p className="text-sm text-gray-500">Remaining Views Needed</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {remainingViews.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                How to Increase Your Views
              </h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-xs">1</span>
                  </div>
                  Create high-quality, engaging content regularly
                </li>
                <li className="flex items-center">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-xs">2</span>
                  </div>
                  Share your content on social media platforms
                </li>
                <li className="flex items-center">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-xs">3</span>
                  </div>
                  Engage with your readers through comments
                </li>
                <li className="flex items-center">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-xs">4</span>
                  </div>
                  Optimize your content for search engines
                </li>
              </ul>
            </div>

            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Monetization Benefits
              </h4>
              <ul className="space-y-2 text-sm text-blue-700">
                {/* <li>• Earn $0.30 per 1,000 views</li> */}
                <li>• Automatic monthly payments via PayPal</li>
                <li>• Access to creator analytics</li>
                <li>• Priority support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              Monetization Application
            </h3>
            <p className="mt-2 text-gray-600">
              Complete this form to start earning from your content. We collect this information 
              to ensure secure payments and maintain platform quality.
            </p>
          </div>
          
          <form onSubmit={handleApply} className="space-y-8">
            {/* Personal Information */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>
                <p className="text-sm text-gray-600">
                  This information helps us verify your identity and ensure compliance with payment regulations.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Legal Name *
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Must match your payment account for successful transfers
                  </p>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth *
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Must be at least 18 years old to participate
                  </p>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-lg font-semibold text-gray-900">Payment Information</h4>
                <p className="text-sm text-gray-600">
                  Your earnings will be sent to your PayPal account monthly when they exceed $50.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PayPal Email *
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Must be a verified PayPal account that can receive payments
                </p>
                <input
                  type="email"
                  required
                  value={formData.paypalEmail}
                  onChange={(e) => setFormData({ ...formData, paypalEmail: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-lg font-semibold text-gray-900">Contact Information</h4>
                <p className="text-sm text-gray-600">
                  We&apos;ll use this to communicate about your earnings and any important updates.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp Number *
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  For important notifications and payment verifications
                </p>
                <input
                  type="tel"
                  required
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="+1234567890"
                  pattern="^\+[0-9]{1,15}$"
                  title="Please enter a valid international phone number starting with +"
                />
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-lg font-semibold text-gray-900">Location Information</h4>
                <p className="text-sm text-gray-600">
                  Required for tax purposes and payment compliance.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <select
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Select your country</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="FR">France</option>
                    <option value="DE">Germany</option>
                    {/* Add more countries as needed */}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City/Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="New York"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Before submitting, please note:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                  <li>All information provided must be accurate and verifiable</li>
                  <li>You must be at least 18 years old to participate</li>
                  <li>Payments are processed monthly for balances over $50</li>
                  <li>Your PayPal account must be verified and able to receive payments</li>
                </ul>
              </div>

              <div className="mt-6 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isApplying}
                  className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isApplying ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (profile?.status === 'REJECTED') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Monetization Application Rejected
            </h3>
            
            <div className="mt-4 max-w-xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                {!canReapply ? (
                  <>
                    <p className="text-sm text-gray-700 mb-4">
                      Your monetization application was rejected. To maintain quality standards, 
                      there is a mandatory waiting period before you can reapply.
                    </p>
                    <div className="bg-white rounded-lg p-4 border border-red-100">
                      <p className="text-sm font-medium text-red-600">
                        Waiting Period: {daysUntilReapply} days remaining
                      </p>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${((30 - daysUntilReapply) / 30) * 100}%` }}
                        />
                      </div>
                    </div>
                    <button
                      disabled
                      className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-400 cursor-not-allowed"
                    >
                      <ClockIcon className="mr-2 h-4 w-4" />
                      Reapply Available in {daysUntilReapply} Days
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-700 mb-4">
                      The waiting period has ended. You can now submit a new application for monetization.
                    </p>
                    <button
                      onClick={() => setShowReapplyModal(true)}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <CheckCircleIcon className="mr-2 h-4 w-4" />
                      Submit New Application
                    </button>
                  </>
                )}
              </div>

              <div className="mt-6 text-left">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  While you wait, you can:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                  <li>Continue creating high-quality content</li>
                  <li>Build your audience and increase views</li>
                  <li>Review our monetization guidelines</li>
                  <li>Engage with your readers through comments</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Current Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Total Views</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalViews.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Potential Monthly Earnings</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${estimatedEarnings.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (profile?.status === 'PENDING') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Application Under Review
              </h3>
              <p className="text-sm text-gray-500">
                Your monetization application is currently being reviewed by our team
              </p>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-100 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-3">
              What happens next?
            </h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                  <div className="absolute inset-0 bg-yellow-200 rounded-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-yellow-800 text-xs font-bold">1</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    Our team reviews your application details (typically within 1-3 business days)
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                  <div className="absolute inset-0 bg-yellow-200 rounded-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-yellow-800 text-xs font-bold">2</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    We verify your provided information and payment details
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                  <div className="absolute inset-0 bg-yellow-200 rounded-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-yellow-800 text-xs font-bold">3</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    You&apos;ll receive an email notification once a decision is made
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Application Details
            </h4>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.fullName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">PayPal Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.paypalEmail}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.location}, {profile.country}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Applied On</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile.appliedAt ? new Date(profile.appliedAt).toLocaleDateString() : 'N/A'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-500">
              <p className="font-medium mb-2">Important Notes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Only 65% of total views are counted towards earnings</li>
                <li>Earnings are calculated at $0.30 per 1,000 counted views</li>
                <li>Payouts are processed automatically when you reach $50</li>
                <li>Payments are made via PayPal on a monthly basis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Monetization Status
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {profile.status === 'PENDING' ? 'Your application is being reviewed' :
               profile.status === 'APPROVED' ? 'Your account is monetized' :
               profile.status === 'REJECTED' ? 'Your application was rejected' :
               'Not eligible for monetization'}
            </p>
            {profile.status === 'REJECTED' && (
              <div className="mt-4 space-y-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                    <div>
                      <p className="text-sm text-red-700">
                        Your monetization application was rejected
                      </p>
                      {!canReapply ? (
                        <p className="text-sm text-red-600 mt-1">
                          You can reapply in {daysUntilReapply} days
                        </p>
                      ) : (
                        <button
                          onClick={() => setIsApplying(true)}
                          className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Reapply Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={`
            rounded-full p-2
            ${profile.status === 'PENDING' ? 'bg-yellow-100' :
              profile.status === 'APPROVED' ? 'bg-green-100' :
              'bg-red-100'}
          `}>
            {profile.status === 'PENDING' ? (
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            ) : profile.status === 'APPROVED' ? (
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            ) : (
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            )}
          </div>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Earnings Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${profile.totalEarnings.toFixed(2)}
                </p>
              </div>
              <BanknotesIcon className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Payout</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${profile.pendingPayout.toFixed(2)}
                </p>
              </div>
              <ClockIcon className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Estimated Monthly</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${estimatedEarnings.toFixed(2)}
                </p>
              </div>
              <BanknotesIcon className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          {profile.pendingPayout >= 50 && (
            <div className="col-span-full bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
                <p className="text-sm text-green-700">
                  Your earnings have reached ${profile.pendingPayout.toFixed(2)}! 
                  A payout will be automatically processed to your PayPal account.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Payouts */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Recent Payouts
        </h3>
        
        <div className="divide-y divide-gray-200">
          {profile.payouts.map((payout) => (
            <div key={payout.createdAt.toString()} className="py-4 flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  ${payout.amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(payout.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${payout.status === 'completed' ? 'bg-green-100 text-green-800' :
                  payout.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'}
              `}>
                {payout.status}
              </span>
            </div>
          ))}

          {profile.payouts.length === 0 && (
            <p className="py-4 text-sm text-gray-500 text-center">
              No payouts yet
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 