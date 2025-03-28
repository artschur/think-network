import Tweet from '@/components/tweet';
import { TweetWithUser } from '@/interfaces';

export default function TweetFeed({
  tweets,
}: {
  tweets: TweetWithUser[];
}) {
  return (
    <div className="space-y-6">
      {tweets.map((tweet) => (
        <Tweet key={tweet.post.id} tweet={tweet} />
      ))}
    </div>
  );
}
