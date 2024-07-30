import VideoService from "../services/videos.service.js";
import { Created } from "../core/success.response.js";

class VideoController {
  async postVideo(req, res) {
    const videoInfo = {
      ...req.body,
      video_thumbnail: req.files["video_thumbnail"] ? req.files["video_thumbnail"][0]?.path : null,
      video_file: req?.files["video_file"][0]?.path,
    };

    const videoData = await VideoService.postVideo(videoInfo);

    new Created({
      message: "Post video successfully!",
      metadata: videoData,
    }).send(res);
  }

  async uploadMultiVideos(req, res) {
    const data = await VideoService.uploadMultipleVideo({listVideos: req.files, user: req.user})

    new Created({
      message: "Your video has already been uploaded! Please wait until we process it!",
      metadata: data
    }).send(res);
  }

}

export default new VideoController();
