'use client'

import { useState, useEffect } from 'react'
import { 
  EyeIcon, 
  HeartIcon, 
  ShareIcon,
  ChatBubbleLeftIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

interface AnalyticsData {
  totalViews: number
  totalReactions: number
  totalShares: number
  totalComments: number
  totalUsers: number
  totalPosts: number
  viewsByCountry: Record<string, number>
  recentViews: {
    date: string
    count: number
  }[]
}

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

// Add these options for the trend chart
const trendChartOptions = {
  responsive: true,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#1f2937',
      bodyColor: '#1f2937',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        label: function(context: any) {
          return `${context.parsed.y.toLocaleString()} views`;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        maxRotation: 0,
        font: {
          size: 12
        }
      }
    },
    y: {
      beginAtZero: true,
      border: {
        display: false
      },
      grid: {
        color: '#f3f4f6'
      },
      ticks: {
        font: {
          size: 12
        },
        callback: function(this: any, value: string | number) {
          if (typeof value === 'number') {
            return value.toLocaleString();
          }
          return value;
        }
      }
    }
  }
} as const;

export default function GlobalAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
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
      const dateRange = customDateRange || getDateRangeFromPeriod(selectedPeriod)
      
      let url = '/api/analytics/global'
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
      setError('Failed to load analytics')
      console.error(err)
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

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!data) return null

  // Add these chart options inside the component
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  }

  return (
    <div className="space-y-8">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <EyeIcon className="h-8 w-8 text-blue-500" />
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
              <p className="text-sm font-medium text-gray-500">Total Reactions</p>
              <p className="text-2xl font-semibold text-gray-900">
                {data.totalReactions.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <ShareIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Shares</p>
              <p className="text-2xl font-semibold text-gray-900">
                {data.totalShares.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <ChatBubbleLeftIcon className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Comments</p>
              <p className="text-2xl font-semibold text-gray-900">
                {data.totalComments.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {data.totalUsers.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-indigo-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Posts</p>
              <p className="text-2xl font-semibold text-gray-900">
                {data.totalPosts.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Engagement Distribution</h3>
          <div className="h-[300px] relative">
            <Doughnut
              data={{
                labels: ['Views', 'Reactions', 'Shares', 'Comments'],
                datasets: [
                  {
                    data: [
                      data.totalViews,
                      data.totalReactions,
                      data.totalShares,
                      data.totalComments,
                    ],
                    backgroundColor: [
                      'rgba(59, 130, 246, 0.8)', // blue
                      'rgba(239, 68, 68, 0.8)',  // red
                      'rgba(34, 197, 94, 0.8)',  // green
                      'rgba(168, 85, 247, 0.8)', // purple
                    ],
                    borderColor: [
                      'rgba(59, 130, 246, 1)',
                      'rgba(239, 68, 68, 1)',
                      'rgba(34, 197, 94, 1)',
                      'rgba(168, 85, 247, 1)',
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                ...chartOptions,
                cutout: '65%',
              }}
            />
          </div>
        </div>

        {/* Views by Country Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Countries</h3>
          <div className="h-[300px] relative">
            <Bar
              data={{
                labels: Object.keys(data.viewsByCountry).slice(0, 5),
                datasets: [
                  {
                    label: 'Views',
                    data: Object.values(data.viewsByCountry).slice(0, 5),
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                ...chartOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* New Views Trend */}
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
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Peak Views</div>
            <div className="text-2xl font-semibold text-blue-700">
              {Math.max(...data.recentViews.map(v => v.count)).toLocaleString()}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Average Views</div>
            <div className="text-2xl font-semibold text-green-700">
              {Math.round(data.recentViews.reduce((acc, v) => acc + v.count, 0) / data.recentViews.length).toLocaleString()}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Today's Views</div>
            <div className="text-2xl font-semibold text-purple-700">
              {(data.recentViews[data.recentViews.length - 1]?.count || 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm text-yellow-600 font-medium">Growth Rate</div>
            <div className="text-2xl font-semibold text-yellow-700">
              {(() => {
                const lastWeek = data.recentViews.slice(-7);
                const prevWeek = data.recentViews.slice(-14, -7);
                const lastWeekTotal = lastWeek.reduce((acc, v) => acc + v.count, 0);
                const prevWeekTotal = prevWeek.reduce((acc, v) => acc + v.count, 0);
                const growth = prevWeekTotal ? ((lastWeekTotal - prevWeekTotal) / prevWeekTotal) * 100 : 0;
                return `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
              })()}
            </div>
          </div>
        </div>
        <div className="h-[400px] relative">
          <Line
            data={{
              labels: data.recentViews.map(({ date }) => 
                new Date(date).toLocaleDateString('en-US', { 
                  month: 'short',
                  day: 'numeric'
                })
              ),
              datasets: [
                {
                  label: 'Views',
                  data: data.recentViews.map(({ count }) => count),
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
              ],
            }}
            options={trendChartOptions}
          />
        </div>
      
      </div>
    </div>
  )
} 