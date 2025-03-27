import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { getRecommendedUsers, SimpleUserInfo } from '@/users';

export default async function WhoToFollow({ user }: { user: SimpleUserInfo }) {
  const users = await getRecommendedUsers({ userId: user.id });

  if (users.length <= 0) {
    return (
      <Card className="backdrop-blur-xl overflow-x-hidden shadow-lg border backdrop-filter">
        <CardHeader className="border-b">
          <h2 className="text-xl font-medium">Who to follow</h2>
        </CardHeader>
        <CardContent className="p-0 px-5 py-4 text-muted-foreground">
          No recommendations available at this time.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-xl overflow-x-hidden shadow-lg border backdrop-filter">
      <CardHeader className="border-b">
        <h2 className="text-xl font-medium">Who to follow</h2>
      </CardHeader>

      <CardContent className="p-0">
        {users.map((user) => (
          <div
            key={user.id}
            className="px-5 py-4 hover:bg-muted/40 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Avatar className="ring-2 ring-muted/30 shadow-md">
                <AvatarFallback>{user.username}</AvatarFallback>
                <AvatarImage src={user.imageUrl} />
              </Avatar>

              <div>
                <div className="font-medium hover:text-primary transition-colors">
                  {user.fullName}
                </div>
                <div className="text-sm text-muted-foreground">
                  @{user.username}
                </div>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="rounded-full shadow-md hover:shadow-lg"
            >
              Follow
            </Button>
          </div>
        ))}
      </CardContent>

      <CardFooter className="p-0">
        <a
          href="#"
          className="block p-5 w-full text-primary hover:bg-muted/40 transition-all border-t"
        >
          Show more
        </a>
      </CardFooter>
    </Card>
  );
}
