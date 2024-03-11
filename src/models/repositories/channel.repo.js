import Channel from "../channel.model.js";

const findChannelById = async (channelId) => {
  return await Channel.findOne({ _id: channelId }).lean();
};

export { findChannelById };
