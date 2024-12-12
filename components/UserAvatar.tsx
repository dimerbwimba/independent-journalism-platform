import { User } from "next-auth"
import Image from "next/image"

interface UserAvatarProps {
  user: User
}

export function UserAvatar({ user }: UserAvatarProps) {
  return (
    <div className="relative w-8 h-8 rounded-full overflow-hidden">
      {user.image ? (
        <Image
          src={user.image}
          alt={user.name || "User avatar"}
          fill
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-sm">
            {user.name?.[0] || "U"}
          </span>
        </div>
      )}
    </div>
  )
} 