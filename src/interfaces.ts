export interface CreatePostInterface {
  userId: string;
  content: string;
  images?: File[];
}

export interface UploadImageTemporary {
  postId: number;
  publicUrl: string;
  storagePath: string;
}

export interface PostWithUser {
  post: {
  id: number;
  content: string;
  createdAt: Date;
  likeCount: number;
  commentCount: number;
  };
  user: {
  id: string;
  fullName: string;
  username: string;
  profileImageUrl: string;
  };
  images?: { publicUrl: string }[];
}