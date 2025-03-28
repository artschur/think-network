import Tweet from '@/components/tweet';
import { getTopPosts } from '@/posts';
import { SimpleUserInfo } from '@/users';

export default async function FeaturedFeed({
  user,
}: {
  user: SimpleUserInfo;
}) {
  const tweets = await getTopPosts();

  return (
    <div className="space-y-6">
      {tweets.map((tweet) => (
        <Tweet key={tweet.post.id} tweet={tweet} />
      ))}
    </div>
  );
}