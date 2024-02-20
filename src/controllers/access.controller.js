import { HEADERS } from "../constants/auth.constant.js";
import { Created, SuccessResponse } from "../core/success.response.js";
import AccessService from "../services/access.service.js";

class AccessController {
  async signUp(req, res) {
    const data = await AccessService.signUp(req.body);

    new Created({
      message: "Sign Up Success",
      metadata: data,
    }).send(res);
  }

  async signIn(req, res) {
    const data = await AccessService.signIn(req.body);

    new SuccessResponse({
      message: "Sign In Success",
      metadata: data,
    }).send(res);
  }

  async signOut(req, res) {
    const data = await AccessService.signOut({ userId: req.user.userId });

    new SuccessResponse({
      message: "Sign Out Success",
      metadata: data,
    }).send(res);
  }

  async refreshToken(req, res) {
    const data = await AccessService.refreshToken({
      userId: req.headers[HEADERS.USERID],
      rToken: req.headers[HEADERS.REFRESH_TOKEN],
    });

    new SuccessResponse({
      message: "Refresh Token Success",
      metadata: data,
    }).send(res);
  }
}

export default new AccessController();
