class OauthService {
  static async OauthGoogleStrategy(accessToken, refreshToken, profile, cb) {
    console.log("profile", profile);
    cb(null, profile);
  }
}

export default OauthService;
