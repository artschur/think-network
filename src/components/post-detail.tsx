
'use client';

import Post from '@/components/post';
import type { SimpleUserInfo } from '@/users';
import { PostResponseWithUser } from '@/posts';

export default function PostDetail({
  post,
  loggedUser,
}: {
  post: PostResponseWithUser;
  loggedUser: SimpleUserInfo;
}) {
  return <Post post={post} loggedUser={loggedUser} />;
}
