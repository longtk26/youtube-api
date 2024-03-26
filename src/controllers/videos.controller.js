import VideoService from "../services/videos.service.js";
import { Created } from "../core/success.response.js";

class VideoController {
  async postVideo(req, res) {
    const videoInfo = {
      ...req.body,
      video_thumbnail: req.files["video_thumbnail"][0].path ?? "",
      video_file: req.files["video_file"][0].path,
    };

    const videoData = await VideoService.postVideo(videoInfo);

    new Created({
      message: "Post video successfully!",
      metadata: videoData,
    }).send(res);
  }
}

export default new VideoController();
