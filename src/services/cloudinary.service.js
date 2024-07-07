import { cloudinary } from "../config/cloudinary.config.js";
import { SERVER_HTTPS } from "../constants/index.constant.js";

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

  static async uploadVideo({ videoFile, folderName, publicId, display_name }) {
    try {
      console.log(`uploadVideo: ${videoFile}`);

      new Promise((resolve, reject) => {
        cloudinary.uploader.upload_large(
          videoFile,
          {
            public_id: publicId,
            folder: folderName,
            display_name: publicId,
            resource_type: "video",
            notification_url: `${SERVER_HTTPS}/videos/hook`
          },
          (err, result) => {
            if (err) {
              console.error("Error uploading video", err);
              reject(err);
            } else {
              console.log("Video uploaded successfully");
              resolve(result);
            }
          }
        );
      });

      return "Your video is being uploaded, please wait for a moment!";
    } catch (error) {
      throw new Error("Error uploading video " + error.message);
    }
  }
}

export default CloudinaryService;
