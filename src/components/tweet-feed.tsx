import Tweet from '@/components/tweet';
import { getPostsByFollowing } from '@/posts';

export default async function TweetFeed({ userId }: { userId: string }) {
  const tweets = await getPostsByFollowing({ userId });

  return (
    <div className="space-y-6">
      {tweets.map((tweet) => (
        <Tweet key={tweet.post.id} tweet={tweet} />
      ))}
    </div>
  );
}
