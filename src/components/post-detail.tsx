
'use client';

import Tweet from '@/components/tweet';
import type { SimpleUserInfo } from '@/users';
import { PostResponseWithUser } from '@/posts';

export default function PostDetail({
  post,
  loggedUser,
}: {
  post: PostResponseWithUser;
  loggedUser: SimpleUserInfo;
}) {
  return <Tweet tweet={post} loggedUser={loggedUser} />;
}
