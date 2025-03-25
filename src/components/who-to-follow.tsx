import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getRecommendedUsers } from '@/users';
import { auth } from '@clerk/nextjs/server';

export default async function WhoToFollow() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('User not authenticated');
  }
  const users = await getRecommendedUsers({ userId: userId });

  return (
    <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg border border-white/20 dark:border-slate-700/20 backdrop-filter">
      <h2 className="text-xl font-medium p-5 border-b border-white/20 dark:border-slate-700/20">
        Who to follow
      </h2>

      <div>
        {users.map((user) => (
          <div
            key={user.id}
            className="px-5 py-4 hover:bg-white/40 dark:hover:bg-slate-700/40 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Avatar className="ring-2 ring-white/30 dark:ring-slate-700/30 shadow-md">
                <AvatarFallback>{user.username}</AvatarFallback>
                <AvatarImage src={user.profilePic} />
              </Avatar>

              <div>
                <div className="font-medium hover:text-blue-500 transition-colors">
                  {user.fullName}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  @{user.username}
                </div>
              </div>
            </div>

            <Button className="rounded-full bg-white/60 dark:bg-slate-700/60 backdrop-blur-md border border-white/20 dark:border-slate-600/20 hover:bg-white/80 dark:hover:bg-slate-600/80 text-slate-900 dark:text-white shadow-md hover:shadow-lg transition-all">
              Follow
            </Button>
          </div>
        ))}
      </div>

      <a
        href="#"
        className="block p-5 text-blue-500 hover:bg-white/40 dark:hover:bg-slate-700/40 transition-all border-t border-white/20 dark:border-slate-700/20"
      >
        Show more
      </a>
    </div>
  );
}
