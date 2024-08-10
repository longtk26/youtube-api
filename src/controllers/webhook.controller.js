class WebhookController {
  async handleCompleteUploadVideo(req, res) {
    // Process the video upload request
    // Call your video processing service here
    console.log(req.body);
    res.status(200).json({ message: "Video upload completed" });
  }

  async handleSNSNotiUpLoadVideo(req, res) {
    // Process the SNS notification
    // Call your video processing service here
    console.log(req);
    res.status(200).json({ message: "SNS notification received" });
  }
}

export default new WebhookController();
