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
      const result = await cloudinary.uploader.upload(videoFile, {
        public_id: publicId,
        folder: folderName,
        resource_type: "video",
      });

      return result.secure_url ? result.secure_url : "";
    } catch (error) {
      throw new Error("Error uploading video");
    }
  }
}

export default CloudinaryService;
