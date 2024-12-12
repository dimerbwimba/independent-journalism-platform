import ProfileSettings from "@/components/dashboard/ProfileSettings"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Edit Profile
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ProfileSettings />
      </div>
    </div>
  )
} 