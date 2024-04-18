import Video from "../video.model.js";

const findVideoById = async (videoId) => {
  const video = await Video.findById(videoId).lean();

  return video;
};

export { findVideoById };
