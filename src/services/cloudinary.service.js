import { cloudinary } from "../config/config.cloudinary.js";

class CloudinaryService {
  static async upLoadFile({ fileName, folderName }) {
    const result = await cloudinary.uploader.upload(fileName.tempFilePath, {
      public_id: fileName.name,
      folder: folderName,
      resource_type: "auto",
    });

    return result.secure_url ? result.secure_url : "";
  }
}

export default CloudinaryService;
