'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import {
    EyeIcon,
    ChatBubbleLeftIcon,
    HeartIcon,
    DocumentTextIcon,
    ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import Link from 'next/link'

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
)

interface PostAnalytics {
    totalPosts: number
    totalViews: number
    totalComments: number
    totalShares: number
    totalReactions: number
    viewsOverTime: {
        date: string
        count: number
    }[]
    topPosts: {
        id: string
        title: string
        slug: string
        views: number
        comments: number
        shares: number
        reactions: number
    }[]
}

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<PostAnalytics | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const { data: session } = useSession()

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await fetch('/api/posts/analytics')
                if (!response.ok) throw new Error('Failed to fetch analytics')
                const data = await response.json()
                setAnalytics(data)
            } catch (error) {
                console.error('Error fetching analytics:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAnalytics()
    }, [])

    if (!session) {
        redirect('/auth/signin')
    }

    if (isLoading) {
        return <LoadingPlaceholder />
    }

    if (!analytics) {
        return null
    }

    const viewsChartData = {
        labels: analytics.viewsOverTime.map(item =>
            new Date(item.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            })
        ),
        datasets: [
            {
                label: 'Views',
                data: analytics.viewsOverTime.map(item => item.count),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                callbacks: {
                    title: (context: any) => context[0].label,
                    label: (context: any) => `Views: ${context.raw.toLocaleString()}`
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    maxTicksLimit: 7
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    callback: function (value: string | number) {
                        return value.toLocaleString()
                    }
                }
            }
        }
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Posts Analytics</h1>
                <p className="mt-1 text-sm text-gray-500">
                    View detailed statistics about your posts performance
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 mb-6">
                <StatCard
                    title="Total Posts"
                    value={analytics.totalPosts}
                    icon={DocumentTextIcon}
                />
                <StatCard
                    title="Total Views"
                    value={analytics.totalViews}
                    icon={EyeIcon}
                />
                <StatCard
                    title="Total Comments"
                    value={analytics.totalComments}
                    icon={ChatBubbleLeftIcon}
                />
                <StatCard
                    title="Total Reactions"
                    value={analytics.totalReactions}
                    icon={HeartIcon}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Views Over Time Chart */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Views Over Time</h3>
                    <div className="h-[300px]">
                        <Line
                            data={viewsChartData}
                            options={chartOptions}
                        />
                    </div>
                </div>

                {/* Top Posts */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Top Performing Posts</h3>
                    <div className="space-y-4">
                        {analytics.topPosts.map(post => (
                            <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <Link href={`/dashboard/posts/single/${post.slug}`}>
                                        <h4 className="font-medium text-gray-900 truncate">{post.title}</h4>
                                    </Link>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <EyeIcon className="h-4 w-4" />
                                            {post.views}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <ChatBubbleLeftIcon className="h-4 w-4" />
                                            {post.comments}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <HeartIcon className="h-4 w-4" />
                                            {post.reactions}
                                        </span>
                                    </div>
                                </div>
                                <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon: Icon }: { title: string, value: number, icon: React.ElementType }) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-semibold text-gray-900">{value.toLocaleString()}</p>
                </div>
            </div>
        </div>
    )
}

function LoadingPlaceholder() {
    return (
        <div className="space-y-6 p-8 animate-pulse">
            <div className="md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="h-8 w-64 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-48 bg-gray-200 rounded" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-lg p-6">
                        <div className="h-6 w-6 bg-gray-200 rounded-full mb-4" />
                        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                        <div className="h-8 w-16 bg-gray-200 rounded mb-2" />
                        <div className="h-3 w-32 bg-gray-200 rounded" />
                    </div>
                ))}
            </div>
        </div>
    )
}  