import { Created, SuccessResponse } from "../core/success.response.js";
import ChannelService from "../services/channels.service.js";

class ChannelController {
  async createChannel(req, res) {
    const bodyData = {
      ...req.body,
      ...req.files,
      channel_user_id: req.user.userId,
    };
    const data = await ChannelService.createChannel(bodyData);

    new Created({
      message: "Channel created successfully",
      metadata: data,
    }).send(res);
  }
  async getChannelByUser(req, res) {
    const data = await ChannelService.getChannelInfomation({
      channel_user_id: req.user.userId,
    });

    new SuccessResponse({
      message: "Channel infomation!!",
      metadata: data,
    }).send(res);
  }

  async getChannelByVistor(req, res) {
    const data = await ChannelService.getChannelInfoByChannelId({
      channel_user_id: req.params.channelId,
    });

    new SuccessResponse({
      message: "Channel infomation!!",
      metadata: data,
    }).send(res);
  }
}

export default new ChannelController();
