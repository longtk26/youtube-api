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
      publicId: "channel_image",
      fileName: channel_image,
      folderName: `channels/${channel_user_id}`,
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

  static async updateChannelInfo({
    channel_name,
    channel_description,
    channel_image,
    channel_user_id,
  }) {
    const foundChannel = await Channel.findOne({ channel_user_id }).lean();
    if (!foundChannel) throw new NotFoundError("Channel not found");

    let imageURL;

    if (channel_image) {
      imageURL = await CloudinaryService.upLoadFile({
        publicId: "channel_image",
        fileName: channel_image,
        folderName: `channels/${channel_user_id}`,
      });
    }

    const updatedChannel = await Channel.findOneAndUpdate(
      { channel_user_id },
      {
        channel_name,
        channel_description,
        channel_image: imageURL,
      },
      { new: true, upsert: true }
    ).lean();

    if (!updatedChannel)
      throw new BadRequestError("Some thing went wrong, please try again");

    return updatedChannel;
  }

  static async deleteChannel({ channel_user_id, channel_id }) {
    const foundChannel = await Channel.findOne({ channel_user_id }).lean();
    if (!foundChannel) throw new NotFoundError("Channel not found");

    const deletedChannel = await Channel.findOneAndDelete({
      _id: channel_id,
    }).lean();

    if (!deletedChannel)
      throw new BadRequestError("Some thing went wrong, please try again");

    return deletedChannel;
  }

  static async subscribeToChannel({ channel_id, user_id }) {
    const foundChannel = await Channel.findOne({ _id: channel_id }).lean();
    if (!foundChannel) throw new NotFoundError("Channel not found");

    const isYourChanel = await Channel.findOne({
      channel_user_id: user_id,
    }).lean();

    if (isYourChanel)
      throw new BadRequestError("You can't subscribe to your own channel");

    const isAlreadySubscribed = await Channel.findOne({
      channel_subscribers: user_id,
    }).lean();

    if (isAlreadySubscribed)
      throw new BadRequestError(
        "You can't subscribe to a channel that already subscribed"
      );

    const updatedChannel = await Channel.findOneAndUpdate(
      { _id: channel_id },
      {
        $inc: { channel_amount_subscribers: 1 },
        $push: { channel_subscribers: user_id },
      },
      { new: true, upsert: true }
    ).select(["channel_name", "channel_amount_subscribers"]);

    return updatedChannel;
  }

  static async unsubscribeFromChannel({ channel_id, user_id }) {
    const foundChannel = await Channel.findOne({ _id: channel_id }).lean();
    if (!foundChannel) throw new NotFoundError("Channel not found");

    const isYourChanel = await Channel.findOne({
      channel_user_id: user_id,
    }).lean();

    if (isYourChanel)
      throw new BadRequestError("You can't unsubscribe from your own channel");

    const isInListSubscribers = await Channel.findOne({
      channel_subscribers: user_id,
    }).lean();

    if (!isInListSubscribers)
      throw new BadRequestError("You are not subscribed to this channel");

    const updatedChannel = await Channel.findOneAndUpdate(
      { _id: channel_id },
      {
        $inc: { channel_amount_subscribers: -1 },
        $pull: { channel_subscribers: user_id },
      },
      { new: true, upsert: true }
    ).select(["channel_name", "channel_amount_subscribers"]);

    return updatedChannel;
  }
}

export default ChannelService;
