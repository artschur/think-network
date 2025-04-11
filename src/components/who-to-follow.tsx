import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getRecommendedUsers, type SimpleUserInfo } from "@/users";
import { FollowButton } from "@/components/follow-button";
import { checkIfFollowing } from "@/followers";
import { UserPlus } from "lucide-react";

export default async function WhoToFollow({ user }: { user: SimpleUserInfo; }) {
  const maxRecommendedUsers = 10;
  const users = await getRecommendedUsers({ userId: user.id, limit: maxRecommendedUsers });

  if (users.length <= 0) {
    return (
      <Card className="w-full backdrop-blur-xl overflow-hidden shadow-lg border border-border/50">
        <CardHeader className="border-b pb-3">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary/70" />
            <h2 className="text-xl font-semibold">Who to follow</h2>
          </div>
        </CardHeader>
        <CardContent className="p-0 px-5 py-6 text-muted-foreground flex items-center justify-center">
          <p className="text-center">No recommendations available at this time.</p>
        </CardContent>
      </Card>
    )
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
    <Card className="w-full backdrop-blur-xl overflow-hidden shadow-lg border border-border/50">
      <CardHeader className="border-b pb-3">
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary/70" />
          <h2 className="text-xl font-semibold">Who to follow</h2>
        </div>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-border/50">
        {usersWithFollowStatus.map((recommendedUser) => (
          <div
            key={recommendedUser.id}
            className="px-5 py-4 hover:bg-muted/30 transition-all duration-200 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Avatar className="ring-2 ring-primary/10 shadow-md border border-border/50 transition-all duration-300 group-hover:ring-primary/30">
                <AvatarFallback className="bg-gradient-to-br from-muted to-muted/70 text-foreground/80">
                  {recommendedUser.username?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
                <AvatarImage src={recommendedUser.imageUrl} />
              </Avatar>

              <div className="transition-all duration-200 max-w-[95px]">
                <div className="font-medium group-hover:text-primary transition-colors duration-200 truncate">
                  {recommendedUser.fullName}
                </div>
                <div className="text-sm text-muted-foreground truncate">@{recommendedUser.username}</div>
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