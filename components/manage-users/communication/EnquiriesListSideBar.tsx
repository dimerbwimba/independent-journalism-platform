'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  EnvelopeIcon, 
  FunnelIcon,
  ChevronDownIcon,
  FlagIcon 
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface CommunicationItem {
  id: string
  type: 'CONTACT' | 'REPORT'
  subject: string
  createdAt: string
  user: {
    name: string
    email: string
  }
  status: string
  reason?: string
}

const TIME_FILTERS = {
  'all': 'All Time',
  'today': 'Today',
  'week': 'This Week',
  'month': 'This Month',
  'year': 'This Year'
}

const STATUS_FILTERS = {
  'all': 'All Status',
  'PENDING': 'Pending',
  'RESOLVED': 'Resolved',
  'SPAM': 'Spam'
}

const TYPE_FILTERS = {
  'all': 'All Types',
  'CONTACT': 'Contacts',
  'REPORT': 'Reports'
}

export default function EnquiriesListSideBar() {
  const [items, setItems] = useState<CommunicationItem[]>([])
  const [filteredItems, setFilteredItems] = useState<CommunicationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [timeFilter, setTimeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const pathname = usePathname()

  useEffect(() => {
    const fetchCommunications = async () => {
      try {
        const response = await fetch('/api/manage-users/communication/list')
        if (!response.ok) throw new Error('Failed to fetch communications')
        
        const data = await response.json()
        const filteredData = data.items.filter((item: CommunicationItem) => 
          item.type === 'CONTACT' || item.type === 'REPORT'
        )
        setItems(filteredData)
        setFilteredItems(filteredData)
      } catch (err) {
        setError('Failed to load communications')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCommunications()
  }, [])

  useEffect(() => {
    if (!items) return

    let filtered = [...items]

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter)
    }

    // Apply time filter
    if (timeFilter !== 'all') {
      const now = new Date()
      const filterDate = new Date()

      switch (timeFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          break
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1)
          break
      }

      filtered = filtered.filter(item => 
        new Date(item.createdAt) >= filterDate
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter)
    }

    setFilteredItems(filtered)
  }, [items, timeFilter, statusFilter, typeFilter])

  if (error) {
    return (
      <div className="flex h-full w-64 flex-col fixed inset-y-0 bg-white border-r border-gray-200">
        <div className="p-4 text-sm text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-64 flex-col fixed inset-y-0 bg-white border-r border-gray-200">
      <div className="flex h-12 mt-12 items-center px-4 justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Communications</h2>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="p-1 hover:bg-gray-100 rounded-md"
        >
          <FunnelIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Filters */}
      {isFilterOpen && (
        <div className="px-4 py-2 space-y-4 border-b border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {Object.entries(TYPE_FILTERS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          
          {/* Time Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Time Period
            </label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {Object.entries(TIME_FILTERS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {Object.entries(STATUS_FILTERS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <nav className="px-2 py-4 space-y-1">
            {filteredItems.length === 0 ? (
              <div className="text-center py-4 text-sm text-gray-500">
                No inquiries found
              </div>
            ) : (
              filteredItems.map((item) => {
                const isActive = pathname.includes(item.id)
                
                return (
                  <Link
                    key={item.id}
                    href={`/dashboard/manage-users/communication/${item.id}`}
                    className={cn(
                      "flex flex-col p-3 text-sm rounded-md transition-colors",
                      "hover:bg-gray-100",
                      isActive ? "bg-gray-100" : "bg-white"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {item.type === 'CONTACT' ? (
                        <EnvelopeIcon className="h-4 w-4 text-gray-500" />
                      ) : (
                        <FlagIcon className="h-4 w-4 text-red-500" />
                      )}
                      <span className="font-medium truncate">{item.subject}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                      <span>{item.user.name}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full",
                        item.status === 'PENDING' ? "bg-yellow-100 text-yellow-800" :
                        item.status === 'RESOLVED' ? "bg-green-100 text-green-800" :
                        "bg-red-100 text-red-800"
                      )}>
                        {item.status}
                      </span>
                      {item.type === 'REPORT' && (
                        <span className="text-xs text-gray-500">
                          {item.reason}
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })
            )}
          </nav>
        )}
      </div>
    </div>
  )
}
