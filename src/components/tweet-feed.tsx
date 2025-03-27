import Tweet from '@/components/tweet';
import { getPostsByFollowing } from '@/posts';
import { SimpleUserInfo } from '@/users';
import { User } from '@clerk/nextjs/server';

export default async function TweetFeed({ user }: { user: SimpleUserInfo }) {
  const tweets = await getPostsByFollowing({ userId: user.id });

  return (
    <div className="space-y-6">
      {tweets.map((tweet) => (
        <Tweet key={tweet.post.id} tweet={tweet} />
      ))}
    </div>
  );
}
