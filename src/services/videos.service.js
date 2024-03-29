import { findChannelById } from "../models/repositories/channel.repo.js";
import { BadRequestError, NotFoundError } from "../core/error.response.js";
import CloudinaryService from "./cloudinary.service.js";
import Video from "../models/video.model.js";
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

    const videoFileUrl = await CloudinaryService.uploadVideo({
      videoFile: video_file,
      folderName: `videos/uploads/${video_channel_id}`,
      publicId: video_title,
    });

    const newVideo = await Video.create({
      video_channel_id,
      video_title,
      video_file: videoFileUrl,
      video_thumbnail: videoThumbNailUrl,
      video_suitable_user,
      video_description,
    });

    if (!newVideo) throw BadRequestError("Something went wrong");

    return newVideo;
  }
}

export default VideoService;
