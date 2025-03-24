import { Tweet } from '@/components/tweet';
import { getPostsByFollowing, PostResponseWithUser } from '@/posts';
import { auth } from '@clerk/nextjs/server';

export default async function TweetFeed() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('User not authenticated');
  }
  const tweets: PostResponseWithUser[] = await getPostsByFollowing({ userId });

  return (
    <div className="space-y-6">
      {tweets.map((tweet) => (
        <Tweet key={tweet.post.id} tweet={tweet} />
      ))}
    </div>
  );
}
