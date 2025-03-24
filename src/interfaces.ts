export interface CreatePostInterface {
  userId: string;
  content: string;
  imagesUrl: Base64URLString[];
}

export interface UploadImageTemporary {
  postId: number;
  publicUrl: string;
  storagePath: string;
}
