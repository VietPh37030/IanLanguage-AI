// src/config/cloudinary.ts - Cloudinary configuration for media uploads
import { Cloudinary } from '@cloudinary/url-gen';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'dfybjrd6j';
const CLOUDINARY_API_KEY = '672824591123185';
// Note: API Secret should NEVER be exposed in client-side code!
// Use it only in your backend/cloud functions

// Initialize Cloudinary
export const cloudinary = new Cloudinary({
    cloud: {
        cloudName: 'dfybjrd6j',
    },
    url: {
        secure: true, // Use HTTPS
    },
});

// Upload preset name (create this in Cloudinary Dashboard -> Settings -> Upload)
export const UPLOAD_PRESET = 'ianlanguage_unsigned'; // Create an unsigned preset

// Upload configuration
export const CLOUDINARY_CONFIG = {
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY,
    uploadPreset: UPLOAD_PRESET,

    // Auto-convert to webp for images
    imageTransformations: {
        format: 'webp',
        quality: 'auto:good',
        fetchFormat: 'auto',
    },

    // Video optimization settings for minimal file size
    videoTransformations: {
        format: 'mp4',
        videoCodec: 'h264',
        quality: 'auto:eco', // eco = smallest file size
        bitRate: '500k', // Lower bitrate for smaller files
    },
};

/**
 * Upload image to Cloudinary with automatic webp conversion
 * @param imageUri - Local URI of the image
 * @param folder - Optional folder name in Cloudinary
 * @returns Promise with upload result
 */
export const uploadImage = async (imageUri: string, folder: string = 'images'): Promise<CloudinaryUploadResult> => {
    const formData = new FormData();

    // Get file name from URI
    const fileName = imageUri.split('/').pop() || 'image.jpg';
    const fileType = fileName.includes('.') ? `image/${fileName.split('.').pop()}` : 'image/jpeg';

    formData.append('file', {
        uri: imageUri,
        type: fileType,
        name: fileName,
    } as any);

    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);

    // Auto-convert to webp
    formData.append('format', 'webp');
    formData.append('resource_type', 'image');

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error.message);
        }

        return {
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || 'Upload failed',
        };
    }
};

/**
 * Upload video to Cloudinary with optimization for minimal file size
 * @param videoUri - Local URI of the video
 * @param folder - Optional folder name in Cloudinary
 * @returns Promise with upload result
 */
export const uploadVideo = async (videoUri: string, folder: string = 'videos'): Promise<CloudinaryUploadResult> => {
    const formData = new FormData();

    const fileName = videoUri.split('/').pop() || 'video.mp4';

    formData.append('file', {
        uri: videoUri,
        type: 'video/mp4',
        name: fileName,
    } as any);

    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);
    formData.append('resource_type', 'video');

    // Eager transformation for size optimization
    formData.append('eager', 'q_auto:eco,vc_h264,br_500k');

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error.message);
        }

        return {
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            duration: result.duration,
            bytes: result.bytes,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || 'Upload failed',
        };
    }
};

/**
 * Get optimized image URL with transformations
 * @param publicId - Cloudinary public ID
 * @param options - Transformation options
 */
export const getOptimizedImageUrl = (
    publicId: string,
    options?: {
        width?: number;
        height?: number;
        crop?: 'fill' | 'fit' | 'scale' | 'thumb';
    }
): string => {
    let transformations = 'f_auto,q_auto:good';

    if (options?.width) {
        transformations += `,w_${options.width}`;
    }
    if (options?.height) {
        transformations += `,h_${options.height}`;
    }
    if (options?.crop) {
        transformations += `,c_${options.crop}`;
    }

    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
};

// Type definitions
export interface CloudinaryUploadResult {
    success: boolean;
    url?: string;
    publicId?: string;
    format?: string;
    width?: number;
    height?: number;
    duration?: number;
    bytes?: number;
    error?: string;
}
