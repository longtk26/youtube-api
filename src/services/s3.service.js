import { PutObjectCommand } from "@aws-sdk/client-s3";
import { clientS3 } from "../config/s3.config.js";

class S3Service {
  static async upLoadFile() {}

  /**
   * @param {Array} listFiles
   * @param {String} listFiles[index].originalname
   * @param {Buffer} listFiles[index].buffer
   * @param {String} listFiles[index].mimetype
   * @param {Int} listFiles[index].size
   */
  static async upLoadMultiFiles({listFiles, user}) {
    for (const file of listFiles) {
      console.log("Starting upload...");
      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${file.mimetype}/${user.userId}/${file.originalname}`,
        Body: file.buffer,
      });

      clientS3.send(command);
    }

    return "success";
  }
}

export default S3Service;
