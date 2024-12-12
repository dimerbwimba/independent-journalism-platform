'use client'

import { 
  DocumentTextIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface Props {
  totalViews: number
}

export default function MonetizationProgress({ totalViews }: Props) {
  const progressPercentage = (totalViews / 10000) * 100
  const remainingViews = 10000 - totalViews

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-medium mb-1">
              <span className="text-gray-700">Progress to Monetization</span>
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
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Current Views</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalViews.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Remaining Views Needed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {remainingViews.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Creation Tips */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Tips to Reach Monetization
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <DocumentTextIcon className="h-6 w-6 text-blue-500" />
              <h4 className="font-medium text-gray-900">Quality Content</h4>
            </div>
            <p className="text-sm text-gray-600">
              Create in-depth, well-researched articles that provide value to your readers
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <ChartBarIcon className="h-6 w-6 text-green-500" />
              <h4 className="font-medium text-gray-900">Consistency</h4>
            </div>
            <p className="text-sm text-gray-600">
              Maintain a regular posting schedule to keep your audience engaged
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <ShareIcon className="h-6 w-6 text-purple-500" />
              <h4 className="font-medium text-gray-900">Promotion</h4>
            </div>
            <p className="text-sm text-gray-600">
              Share your content on social media and relevant communities
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <ChatBubbleLeftIcon className="h-6 w-6 text-red-500" />
              <h4 className="font-medium text-gray-900">Engagement</h4>
            </div>
            <p className="text-sm text-gray-600">
              Respond to comments and build a community around your content
            </p>
          </div>
        </div>
      </div>

      {/* Milestone Tracker */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Milestones
        </h3>
        <div className="space-y-4">
          {[1000, 2500, 5000, 7500, 10000].map((milestone) => {
            const achieved = totalViews >= milestone
            return (
              <div 
                key={milestone}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  achieved ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    achieved ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <EyeIcon className={`w-5 h-5 ${
                      achieved ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <span className={`font-medium ${
                    achieved ? 'text-green-900' : 'text-gray-900'
                  }`}>
                    {milestone.toLocaleString()} Views
                  </span>
                </div>
                {achieved && (
                  <span className="text-sm text-green-600">Achieved!</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 