import { BadRequestError, NotFoundError } from "../core/error.response.js";
import Channel from "../models/channel.model.js";
import CloudinaryService from "./cloudinary.service.js";

class ChannelService {
  static async createChannel({
    channel_user_id,
    channel_name,
    channel_description,
    channel_image,
  }) {
    const foundChannel = await Channel.findOne({ channel_user_id }).lean();
    if (foundChannel) throw new BadRequestError("You already have a channel");

    const imageURL = await CloudinaryService.upLoadFile({
      fileName: channel_image,
      folderName: "channels_profile",
    });

    const newChannel = await Channel.create({
      channel_user_id,
      channel_name,
      channel_description,
      channel_image: imageURL,
    });

    if (!newChannel)
      throw new BadRequestError("Some thing went wrong, please try again");

    return newChannel;
  }

  static async getChannelInfomation({ channel_user_id }) {
    const foundChannel = await Channel.findOne({ channel_user_id }).lean();
    if (!foundChannel) throw new NotFoundError("You don't have a channel");

    return foundChannel;
  }

  static async getChannelInfoByChannelId({ channel_id }) {
    const foundChannel = await Channel.findOne({ channel_id }).lean();
    if (!foundChannel) throw new NotFoundError("Channel not found");

    return foundChannel;
  }
}

export default ChannelService;
