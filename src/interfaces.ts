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
