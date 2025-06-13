import Post from '@/components/post';
import { PostWithUser } from '@/interfaces';
import { SimpleUserInfo } from '@/users';

export default function PostFeed({
  posts,
  loggedUser,
}: {
  posts: PostWithUser[];
  loggedUser: SimpleUserInfo;
}) {
  return (
    <div className="space-y-6 w-full ">
      {posts.map((post) => (
        <Post key={post.post.id} post={post} loggedUser={loggedUser} />
      ))}
    </div>
  );
}
