import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(
  file: string | Buffer,
  folder: string = 'portfolio',
  options?: { width?: number; height?: number; crop?: string }
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(
    typeof file === 'string' ? file : `data:image/jpeg;base64,${file.toString('base64')}`,
    {
      folder,
      resource_type: 'image',
      transformation: options
        ? [{ width: options.width, height: options.height, crop: options.crop || 'fill' }]
        : undefined,
    }
  );
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export async function uploadProductImage(
  file: string | Buffer,
  productName: string
): Promise<{ url: string; publicId: string }> {
  const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return uploadImage(file, 'products', { width: 800, height: 800, crop: 'fill' });
}

export async function uploadBlogImage(
  file: string | Buffer,
  postSlug: string
): Promise<{ url: string; publicId: string }> {
  return uploadImage(file, 'blog', { width: 1200, height: 630, crop: 'fill' });
}

export default cloudinary;
