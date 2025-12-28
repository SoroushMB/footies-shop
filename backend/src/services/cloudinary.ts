import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/index.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

export interface UploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Upload an image to Cloudinary
 */
export async function uploadImage(
  file: string | Buffer,
  options: {
    folder?: string;
    publicId?: string;
    transformation?: object;
  } = {}
): Promise<UploadResult> {
  const uploadOptions: Record<string, unknown> = {
    folder: options.folder || 'footies-shop',
    resource_type: 'image',
    transformation: options.transformation || [
      { quality: 'auto', fetch_format: 'auto' },
    ],
  };

  if (options.publicId) {
    uploadOptions.public_id = options.publicId;
  }

  const result = await cloudinary.uploader.upload(
    typeof file === 'string' ? file : `data:image/jpeg;base64,${file.toString('base64')}`,
    uploadOptions
  );

  return {
    publicId: result.public_id,
    url: result.url,
    secureUrl: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
  };
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  const result = await cloudinary.uploader.destroy(publicId);
  return result.result === 'ok';
}

/**
 * Generate an optimized image URL
 */
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
  } = {}
): string {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: options.quality || 'auto',
    width: options.width,
    height: options.height,
    crop: options.crop || 'fill',
    secure: true,
  });
}

export { cloudinary };

