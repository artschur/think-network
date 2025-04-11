import { getRecommendedUsers, type SimpleUserInfo } from "@/users"
import { checkIfFollowing } from "@/followers"
import WhoToFollow from "@/components/who-to-follow"

export default async function WhoToFollowWrapper({ user }: { user: SimpleUserInfo }) {
  const maxRecommendedUsers = 10
  const users = await getRecommendedUsers({ userId: user.id, limit: maxRecommendedUsers })

  const usersWithFollowStatus = await Promise.all(
    users.map(async (recommendedUser) => {
      const isFollowing = await checkIfFollowing({
        userId: user.id,
        followingId: recommendedUser.id,
      }).catch(() => false)

      return {
        ...recommendedUser,
        isFollowing,
        userId: user.id,
      }
    }),
  )

  return <WhoToFollow initialUsers={usersWithFollowStatus} />
}
