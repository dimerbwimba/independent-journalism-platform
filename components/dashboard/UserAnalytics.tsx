'use client'

import { useState, useEffect } from 'react'
import { 
  DocumentTextIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  ShareIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  CoreScaleOptions,
  Scale
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import Link from 'next/link'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface TopPost {
  title: string
  slug: string
  views: number
  comments: number
  reactions: number
  shares: number
}

interface CategoryEngagement {
  category: {
    id: string;
    name: string;
  };
  _count: {
    posts: number;
    views: number;
    reactions: number;
    comments: number;
  };
  engagement: {
    perPost: {
      views: number;
      reactions: number;
      comments: number;
    };
  };
}

interface AnalyticsData {
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  totalComments: number;
  totalReactions: number;
  totalShares: number;
  viewsTrend: Array<{
    date: string;
    count: number;
  }>;
  viewsByCountry: Array<{
    country: string;
    count: number;
  }>;
  postEngagement: CategoryEngagement[];
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#111827',
      bodyColor: '#111827',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        label: function(context: any) {
          return `${context.parsed.y.toLocaleString()} views`
        }
      }
    }
  },
  scales: {
    x: {
      type: 'category',
      grid: {
        display: false
      },
      ticks: {
        maxRotation: 0,
        font: {
          size: 11
        },
        color: '#6B7280'
      }
    },
    y: {
      type: 'linear',
      beginAtZero: true,
      grid: {
        color: '#f3f4f6'
      },
      ticks: {
        padding: 8,
        font: {
          size: 11
        },
        color: '#6B7280',
        callback: function(this: Scale<CoreScaleOptions>, tickValue: number | string) {
          return typeof tickValue === 'number' ? tickValue.toLocaleString() : tickValue;
        }
      }
    }
  }
} as const;

const TIME_PERIODS = {
  '7d': '7 Days',
  '30d': '30 Days',
  '90d': '90 Days',
  '1y': '1 Year',
  'all': 'All Time'
}

interface DateRange {
  startDate: Date
  endDate: Date
}

function getDateRangeFromPeriod(period: string): DateRange | null {
  if (period === 'all') return null

  const endDate = new Date()
  const startDate = new Date()

  switch (period) {
    case '7d':
      startDate.setDate(endDate.getDate() - 7)
      break
    case '30d':
      startDate.setDate(endDate.getDate() - 30)
      break
    case '90d':
      startDate.setDate(endDate.getDate() - 90)
      break
    case '1y':
      startDate.setFullYear(endDate.getFullYear() - 1)
      break
    default:
      return null
  }

  return { startDate, endDate }
}

export default function UserAnalytics() {
  const [data, setData] = useState<AnalyticsData>({
    totalPosts: 0,
    publishedPosts: 0,
    totalViews: 0,
    totalComments: 0,
    totalReactions: 0,
    totalShares: 0,
    viewsTrend: [],
    viewsByCountry: [],
    postEngagement: []
  });
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [customDateRange, setCustomDateRange] = useState<DateRange | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [selectedPeriod, customDateRange])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const dateRange = customDateRange || getDateRangeFromPeriod(selectedPeriod)
      
      let url = '/api/analytics/user'
      if (dateRange) {
        const params = new URLSearchParams({
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString()
        })
        url += `?${params.toString()}`
      }

      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch analytics')
      
      const data = await response.json()
      setData(data)
    } catch (err) {
      console.error(err)
      setError('Failed to load analytics')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="animate-pulse space-y-8">
      {[1, 2, 3].map((n) => (
        <div key={n} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  }

  if (error) return <div className="text-red-500">{error}</div>
  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Time Period Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Time Period:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(TIME_PERIODS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedPeriod(key)
                  setCustomDateRange(null)
                }}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedPeriod === key && !customDateRange
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="px-3 py-1 rounded-md border border-gray-300 text-sm"
                onChange={(e) => {
                  const startDate = new Date(e.target.value)
                  setCustomDateRange(prev => ({
                    startDate,
                    endDate: prev?.endDate || new Date()
                  }))
                  setSelectedPeriod('')
                }}
                value={customDateRange?.startDate.toISOString().split('T')[0] || ''}
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                className="px-3 py-1 rounded-md border border-gray-300 text-sm"
                onChange={(e) => {
                  const endDate = new Date(e.target.value)
                  setCustomDateRange(prev => ({
                    startDate: prev?.startDate || new Date(),
                    endDate
                  }))
                  setSelectedPeriod('')
                }}
                value={customDateRange?.endDate.toISOString().split('T')[0] || ''}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Posts</p>
              <p className="text-2xl font-semibold text-gray-900">
                {data.publishedPosts}/{data.totalPosts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <EyeIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="text-2xl font-semibold text-gray-900">
                {data.totalViews.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <HeartIcon className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Engagement</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(data.totalComments + data.totalReactions).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Views Trend */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Views Trend</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
              <span className="text-sm text-gray-600">Daily Views</span>
            </div>
            <div className="text-sm text-gray-500">
              Total: {data.totalViews.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Peak Views</div>
            <div className="text-2xl font-semibold text-blue-700">
              {Math.max(...data.viewsTrend.map(v => v.count)).toLocaleString()}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Average Views</div>
            <div className="text-2xl font-semibold text-green-700">
              {Math.round(data.viewsTrend.reduce((acc, v) => acc + v.count, 0) / data.viewsTrend.length).toLocaleString()}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Today's Views</div>
            <div className="text-2xl font-semibold text-purple-700">
              {(data.viewsTrend[data.viewsTrend.length - 1]?.count || 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm text-yellow-600 font-medium">Growth Rate</div>
            <div className="text-2xl font-semibold text-yellow-700">
              {(() => {
                const lastWeek = data.viewsTrend.slice(-7);
                const prevWeek = data.viewsTrend.slice(-14, -7);
                const lastWeekTotal = lastWeek.reduce((acc, v) => acc + v.count, 0);
                const prevWeekTotal = prevWeek.reduce((acc, v) => acc + v.count, 0);
                const growth = prevWeekTotal ? ((lastWeekTotal - prevWeekTotal) / prevWeekTotal) * 100 : 0;
                return `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
              })()}
            </div>
          </div>
        </div>

        <div className="h-[300px]">
          <Line
            data={{
              labels: data.viewsTrend.map(({ date }) => 
                new Date(date).toLocaleDateString('en-US', { 
                  month: 'short',
                  day: 'numeric'
                })
              ),
              datasets: [
                {
                  data: data.viewsTrend.map(({ count }) => count),
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  fill: true,
                  tension: 0.3,
                  pointRadius: 4,
                  pointBackgroundColor: 'rgb(59, 130, 246)',
                  pointBorderColor: 'rgb(255, 255, 255)',
                  pointBorderWidth: 2,
                  pointHoverRadius: 6,
                  pointHoverBackgroundColor: 'rgb(59, 130, 246)',
                  pointHoverBorderColor: 'rgb(255, 255, 255)',
                  pointHoverBorderWidth: 2,
                }
              ]
            }}
            options={chartOptions}
          />
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-medium text-gray-900">Top Countries</h3>
          <div className="text-sm text-gray-500">
            Total Views: {data.viewsByCountry.reduce((acc, { count }) => acc + count, 0).toLocaleString()}
          </div>
        </div>

        <div className="space-y-8">
          {data.viewsByCountry.map(({ country, count }, index) => {
            // Calculate total views
            const totalViews = data.viewsByCountry.reduce((acc, { count }) => acc + count, 0);
            // Calculate percentage of total views instead of relative to highest
            const percentage = (count / totalViews) * 100;
            
            return (
              <div key={country} className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className={`
                      w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium
                      ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-50 text-blue-700'}
                    `}>
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {country}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {count.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">views</span>
                  </div>
                </div>
                
                {/* Progress bar container */}
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  {/* Progress bar fill */}
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ease-out
                      ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                        index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                        index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                        'bg-gradient-to-r from-blue-400 to-blue-500'}
                    `}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                {/* Percentage badge */}
                <div className="absolute right-0 -top-7 bg-gray-50 px-2 py-0.5 rounded-full">
                  <span className="text-xs font-medium text-gray-600">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
          
          {data.viewsByCountry.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No country data available</p>
              <p className="text-sm text-gray-400 mt-1">Views will appear here once your content gets traffic</p>
            </div>
          )}
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Category Performance</h3>
            <p className="text-sm text-gray-500 mt-1">How your posts perform in different categories</p>
          </div>
          <div className="bg-blue-50 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-blue-700">
              {data?.postEngagement?.length || 0} Categories
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.postEngagement?.map((category) => {
            const totalEngagements = category._count.reactions + category._count.comments;
            const engagementRate = ((totalEngagements) / 
              Math.max(category._count.views, 1) * 100).toFixed(1);
            
            return (
              <div 
                key={category.category.id}
                className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-200 transition-colors"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-5">
                  <h4 className="text-base font-semibold text-gray-900">
                    {category.category.name}
                  </h4>
                  <div className="text-xs text-gray-500">
                    {category._count.posts} posts
                  </div>
                </div>

                {/* Per Post Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-5">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-gray-600 mb-1">
                      <EyeIcon className="h-4 w-4" />
                      <span className="text-xs">Avg. V</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {Math.round(category.engagement.perPost.views).toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-gray-600 mb-1">
                      <HeartIcon className="h-4 w-4" />
                      <span className="text-xs">Avg. R</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {Math.round(category.engagement.perPost.reactions).toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-gray-600 mb-1">
                      <ChatBubbleLeftIcon className="h-4 w-4" />
                      <span className="text-xs">Avg. C</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {Math.round(category.engagement.perPost.comments).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Total Metrics */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Views</span>
                    <span className="font-medium text-gray-900">
                      {category._count.views.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Reactions</span>
                    <span className="font-medium text-gray-900">
                      {category._count.reactions.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Comments</span>
                    <span className="font-medium text-gray-900">
                      {category._count.comments.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span className="text-gray-600">Engagement Rate</span>
                    <span className={`font-medium ${
                      Number(engagementRate) > 5 ? 'text-green-600' :
                      Number(engagementRate) > 2 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {engagementRate}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {(!data?.postEngagement || data.postEngagement.length === 0) && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <DocumentTextIcon className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Categories Yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add categories to your posts to see performance metrics
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 