import { v2 as cloudinary } from "cloudinary";

const { CLOUD_DINARY_API_KEY, CLOUD_DINARY_API_SECRET, CLOUD_DINARY_NAME } =
  process.env;

const cloudUrl = `CLOUDINARY_URL=cloudinary://${CLOUD_DINARY_API_KEY}:${CLOUD_DINARY_API_SECRET}@${CLOUD_DINARY_NAME}`;

cloudinary.config({
  cloud_name: CLOUD_DINARY_NAME,
  api_key: CLOUD_DINARY_API_KEY,
  secure: true,
  api_secret: CLOUD_DINARY_API_SECRET,
});

export { cloudinary, cloudUrl };
