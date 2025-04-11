import Tweet from '@/components/tweet';
import { TweetWithUser } from '@/interfaces';
import { SimpleUserInfo } from '@/users';

export default function TweetFeed({
  tweets,
  loggedUser,
}: {
  tweets: TweetWithUser[];
  loggedUser: SimpleUserInfo;
}) {
  return (
    <div className="space-y-6 md:min-w-2xl ">
      {tweets.map((tweet) => (
        <Tweet key={tweet.post.id} tweet={tweet} loggedUser={loggedUser} />
      ))}
    </div>
  );
}
