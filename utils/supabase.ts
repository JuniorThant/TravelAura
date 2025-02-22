import { createClient } from '@supabase/supabase-js';

const bucket = 'travel-aura';

const url = process.env.SUPABASE_URL as string;
const key = process.env.SUPABASE_KEY as string;

if (!url || !key) {
  throw new Error('Supabase URL or KEY is missing in environment variables.');
}

const supabase = createClient(url, key);

export default supabase

export const UploadImage = async (image: File): Promise<string> => {
  try {
    // Ensure the image file is valid
    if (!image || !(image instanceof File)) {
      throw new Error('Invalid image file provided.');
    }

    const timestamp = Date.now();
    const newName = `${timestamp}-${image.name}`;

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(newName, image, { cacheControl: '3600' });

    if (error) {
      console.error('Upload error:', error.message);
      throw new Error(`Image upload failed: ${error.message}`);
    }

    if (!data) {
      throw new Error('Upload response is empty.');
    }

    // Get the public URL of the uploaded image
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(newName);

    if (!publicUrlData?.publicUrl) {
      throw new Error('Failed to retrieve the public URL.');
    }

    return publicUrlData.publicUrl;
  } catch (error) {
    // Narrow the type of error
    if (error instanceof Error) {
      console.error('Error in UploadImage:', error.message);
      throw new Error(error.message);
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unknown error occurred during image upload.');
    }
  }
};

export const UploadFile = async (file: File): Promise<string> => {
  try {
    // Validate file
    if (!file || !(file instanceof File)) {
      throw new Error('Invalid file provided.');
    }
    if (file.type !== 'application/pdf') {
      throw new Error('Only PDFs are allowed.');
    }

    // Generate unique file name
    const timestamp = Date.now();
    const newName = `${timestamp}-${file.name.replace(/\s+/g, '_')}`;

    // Generate a presigned URL for direct upload
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(newName);

    if (signedUrlError || !signedUrlData) {
      throw new Error(`Failed to generate signed URL: ${signedUrlError?.message}`);
    }

    // Upload file using the presigned URL
    const uploadResponse = await fetch(signedUrlData.signedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`File upload failed with status: ${uploadResponse.status}`);
    }

    // Get public URL after upload
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(newName);

    if (!publicUrlData?.publicUrl) {
      throw new Error('Failed to retrieve the public URL.');
    }

    console.log('File uploaded successfully:', publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in UploadFile:', error);
    throw new Error(error instanceof Error ? error.message : 'An unknown error occurred during file upload.');
  }
};

