class WebhookController {
  async handleCompleteUploadVideo(req, res) {
    // Process the video upload request
    // Call your video processing service here
    console.log(req.body);
    res.status(200).json({ message: "Video upload completed" });
  }
}

export default new WebhookController();
