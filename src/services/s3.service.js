import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { clientS3 } from "../config/s3.config.js";
import { findVideoById } from "../models/repositories/video.repo.js";
import VideoService from "./videos.service.js";

class S3Service {
  /**
   * @param {Array} listFiles
   * @param {String} listFiles[index].originalname
   * @param {Buffer} listFiles[index].buffer
   * @param {String} listFiles[index].mimetype
   * @param {String} listFiles[index].publicId
   * @param {Int} listFiles[index].size
   */
  static async upLoadMultiFiles({ listFiles, channelUserId }) {
    console.log("Uploading........");

    for (const file of listFiles) {
      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${file.mimetype}/${channelUserId}/${file.publicId}.mp4`,
        Body: file.buffer,
      });

      clientS3.send(command);
    }

    return "success";
  }

  static async getPresignedUrl({ bucket, key }) {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    return getSignedUrl(clientS3, command, { expiresIn: 3600 });
  }

  static async s3ObjectCreated({ s3VideoId, s3VideoKey }) {
    try {
      const foundVideo = await findVideoById(s3VideoId);
      if (!foundVideo) throw new NotFoundError("Video not found");

      const presignedUrl = await S3Service.getPresignedUrl({
        bucket: process.env.S3_BUCKET_NAME,
        key: s3VideoKey,
      });
      console.log("s3videoId::::", s3VideoId);
      console.log("s3VideoKey::::", s3VideoKey);
      console.log("PresignedUrl::::", presignedUrl);

      await VideoService.updateVideoInfo({
        video_id: s3VideoId,
        video_file: presignedUrl,
      });
    } catch (error) {
      console.log(`Error while updating video info: ${error.message}`);
      return "failed";
    }
    return "success";
  }
}

export default S3Service;
