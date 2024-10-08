import { findChannelById } from "../models/repositories/channel.repo.js";
import { BadRequestError, NotFoundError } from "../core/error.response.js";
import CloudinaryService from "./cloudinary.service.js";
import Video from "../models/video.model.js";
import S3Service from "./s3.service.js";
import Channel from "../models/channel.model.js";
class VideoService {
  static async postVideo({
    video_channel_id,
    video_file,
    video_thumbnail,
    video_suitable_user,
    video_description,
    video_title,
  }) {
    console.log(`video-file: ${video_file}`);
    console.log(`video-thumbnail: ${video_thumbnail}`);

    const foundChannel = await findChannelById(video_channel_id);
    if (!foundChannel) throw new NotFoundError("Channel not found");
    if (!video_file) throw BadRequestError("Missing video file");

    let videoThumbNailUrl;
    if (video_thumbnail) {
      videoThumbNailUrl = await CloudinaryService.upLoadFile({
        fileName: video_thumbnail,
        folderName: `videos/thumbnails/${video_channel_id}`,
        publicId: video_title,
      });
    }

    const newVideo = await Video.create({
      video_channel_id,
      video_title,
      video_thumbnail: videoThumbNailUrl,
      video_suitable_user,
      video_description,
    });

    if (!newVideo) throw BadRequestError("Something went wrong");

    const statusUpload = await CloudinaryService.uploadVideo({
      videoFile: video_file,
      folderName: `videos/uploads/${video_channel_id}`,
      publicId: newVideo._id,
      display_name: video_title,
    });

    const result = {
      ...newVideo,
      statusUpload,
    };

    return result;
  }

  static async updateVideoInfo({
    video_id,
    video_thumbnail,
    video_file,
    video_suitable_user,
    video_description,
    video_title,
  }) {
    const updateVideo = await Video.findByIdAndUpdate(
      video_id,
      {
        video_title,
        video_thumbnail,
        video_file,
        video_suitable_user,
        video_description,
      },
      { new: true, upsert: true }
    ).lean();

    if (!updateVideo) throw new NotFoundError("Video not found");

    return updateVideo;
  }

  /**
   * @param {Array} listVideos
   * @param {Buffer} listVideos[index].buffer
   * @param {String} listVideos[index].originalname
   * @param {String} listVideos[index].mimetype
   * @param {Object} user
   */

  static async uploadMultipleVideo({ listVideos, user }) {
    const channelUser = await Channel.findOne({ channel_user_id: user.userId });
    if (!channelUser) throw new BadRequestError("User doesn't have channel");

    const listFilesPushedToS3 = [];
    const listFilesResponse = [];

    for (const file of listVideos) {
      const videoTitleWithoutExtension = file.originalname.split(".")[0]; // remove file extension

      const newVideo = await Video.create({
        video_channel_id: channelUser._id,
        video_title: videoTitleWithoutExtension,
      });

      if (!newVideo)
        throw new BadRequestError("Something went wrong with upload video");

      const fileUpload = {
        ...file,
        publicId: newVideo._id,
      };

      const fileResponse = {
        video_id: newVideo._id,
        video_title: file.originalname.split(".")[0], 
      }

      listFilesResponse.push(fileResponse);
      listFilesPushedToS3.push(fileUpload);
    }

    const result = await S3Service.upLoadMultiFiles({
      listFiles: listFilesPushedToS3,
      channelUserId: channelUser._id,
    });

    if (result !== "success")
      throw new BadRequestError("Something went wrong with upload S3");

    return listFilesResponse;
  }

  /**
   *
   * @param {Object} videoInfo
   *
   */
  static async updateUrlVideo(videoInfo) {
    console.log(videoInfo);
    return "success";
  }
}

export default VideoService;
