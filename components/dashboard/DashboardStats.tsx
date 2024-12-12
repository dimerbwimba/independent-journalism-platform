interface DashboardStatsProps {
  stats: {
    totalUsers?: number
    totalPosts?: number
    totalComments?: number
    userPosts?: number
    userComments?: number
  }
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.totalUsers && (
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
        />
      )}
      
      {stats.totalPosts && (
        <StatCard
          title="Total Posts"
          value={stats.totalPosts}
          icon="📝"
        />
      )}
      
      {stats.userPosts && (
        <StatCard
          title="Your Posts"
          value={stats.userPosts}
          icon="✍️"
        />
      )}
      
      {stats.totalComments && (
        <StatCard
          title="Total Comments"
          value={stats.totalComments}
          icon="💬"
        />
      )}
      
      {stats.userComments && (
        <StatCard
          title="Your Comments"
          value={stats.userComments}
          icon="💭"
        />
      )}
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: string
}

const StatCard = ({ title, value, icon }: StatCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

export default DashboardStats 