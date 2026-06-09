import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudName && apiKey && apiSecret);
}

export async function uploadImage(buffer: Buffer, filename: string): Promise<string> {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary not configured (set CLOUDINARY_* env vars).");
  }

  return await new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "liftingsocial-foods/products",
        public_id: filename.replace(/\.[^.]+$/, ""),
        resource_type: "image",
        overwrite: false,
      },
      (err, result) => {
        if (err) return reject(err);
        if (!result?.secure_url) return reject(new Error("Cloudinary returned no URL"));
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}
