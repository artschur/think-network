import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getRecommendedUsers, type SimpleUserInfo } from "@/users";
import { FollowButton } from "@/components/follow-button";
import { checkIfFollowing } from "@/followers";

export default async function WhoToFollow({ user }: { user: SimpleUserInfo; }) {
  const users = await getRecommendedUsers({ userId: user.id });

  if (users.length <= 0) {
    return (
      <Card className="w-full backdrop-blur-xl overflow-x-hidden shadow-lg border backdrop-filter">
        <CardHeader className="border-b">
          <h2 className="text-xl font-medium">Who to follow</h2>
        </CardHeader>
        <CardContent className="p-0 px-5 py-4 text-muted-foreground">
          No recommendations available at this time.
        </CardContent>
      </Card>
    );
  }

  const usersWithFollowStatus = await Promise.all(
    users.map(async (recommendedUser) => {

      const isFollowing = await checkIfFollowing({
        userId: user.id,
        followingId: recommendedUser.id,
      }).catch(() => false);

      return {
        ...recommendedUser,
        isFollowing,
      };
    }),
  );

  return (
    <Card className="w-full backdrop-blur-xl overflow-x-hidden shadow-lg border backdrop-filter">
      <CardHeader className="border-b">
        <h2 className="text-xl font-medium">Who to follow</h2>
      </CardHeader>

      <CardContent className="p-0">
        {usersWithFollowStatus.map((recommendedUser) => (
          <div
            key={recommendedUser.id}
            className="px-5 py-4 hover:bg-muted/40 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Avatar className="ring-2 ring-muted/30 shadow-md">
                <AvatarFallback>{recommendedUser.username}</AvatarFallback>
                <AvatarImage src={recommendedUser.imageUrl} />
              </Avatar>

              <div>
                <div className="font-medium hover:text-primary transition-colors">{recommendedUser.fullName}</div>
                <div className="text-sm text-muted-foreground">@{recommendedUser.username}</div>
              </div>
            </div>

            <FollowButton
              userId={user.id}
              followingId={recommendedUser.id}
              initiallyFollowing={recommendedUser.isFollowing}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}