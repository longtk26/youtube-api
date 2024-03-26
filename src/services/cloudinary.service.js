import { cloudinary } from "../config/cloudinary.config.js";

class CloudinaryService {
  static async upLoadFile({ fileName, folderName, publicId }) {
    try {
      const result = await cloudinary.uploader.upload(fileName, {
        public_id: publicId,
        folder: folderName,
        resource_type: "auto",
      });

      return result.secure_url ? result.secure_url : "";
    } catch (error) {
      throw new Error("Cloudinary upload image failed " + error);
    }
  }

  static async uploadVideo({ videoFile, folderName, publicId }) {
    try {
      console.log(`uploadVideo: ${videoFile}`);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_large(
          videoFile,
          {
            public_id: publicId,
            folder: folderName,
            resource_type: "video",
          },
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });

      return result.secure_url ? result.secure_url : "";
    } catch (error) {
      throw new Error("Error uploading video " + error.message);
    }
  }
}

export default CloudinaryService;
