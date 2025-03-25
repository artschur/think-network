import Tweet from '@/components/tweet';
import { getPostsByFollowing } from '@/posts';
import { auth } from '@clerk/nextjs/server';

export default async function TweetFeed() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('User not authenticated');
  }

  const tweets = await getPostsByFollowing({ userId });

  return (
    <div className="space-y-6">
      {tweets.map((tweet) => (
        <Tweet key={tweet.post.id} tweet={tweet} />
      ))}
    </div>
  );
}
