import { Created } from "../core/success.response.js";
import AccessService from "../services/access.service.js";

class AccessController {
  async signUp(req, res) {
    const data = await AccessService.signUp(req.body);

    new Created({
      message: "Sign Up Success",
      metadata: data,
    }).send(res);
  }
}

export default new AccessController();
