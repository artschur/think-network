'use server';

import { randomUUID } from 'crypto';
import { UploadImageTemporary } from './interfaces';
import { supabase } from './db';
import { db } from './db';
import { imagesTable } from './db/schema';
import { eq } from 'drizzle-orm';

export async function uploadPostImages({
  postId,
  images,
}: {
  postId: number;
  images: File[];
}): Promise<{ publicUrls: string[] }> {
  const imagesToInsert: UploadImageTemporary[] = [];
  if (!images || !images.length) {
    throw new Error('No images provided');
  }
  for (const image of images) {
    const imageName = randomUUID();
    const imagePath = `posts/${postId}/${imageName}`;
    const { error } = await supabase.storage
      .from('media')
      .upload(imagePath, image, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      throw new Error(`Error uploading image: ${error.message}`);
    }

    const { data } = supabase.storage.from('media').getPublicUrl(imagePath);

    if (!data) {
      throw new Error('Error getting public URL');
    }

    imagesToInsert.push({
      postId: postId,
      publicUrl: data.publicUrl,
      storagePath: imagePath,
    });
  }
  if (!imagesToInsert.length) {
    throw new Error('No images to upload');
  }

  await db.insert(imagesTable).values(imagesToInsert);

  return {
    publicUrls: imagesToInsert.map((image) => image.publicUrl),
  };
}

export async function deletePostImages({ postId }: { postId: number }) {
  const images = await db
    .select({ storagePath: imagesTable.storagePath })
    .from(imagesTable)
    .where(eq(imagesTable.postId, postId));

  if (images.length === 0) {
    return;
  }

  const paths = images.map((img) => img.storagePath);
  const { error } = await supabase.storage.from('media').remove(paths);

  if (error) {
    console.error('Error deleting images from storage:', error);
  }

  await db.delete(imagesTable).where(eq(imagesTable.postId, postId));
}