import { verifyAccessToken } from "../auth/jwt.auth.js";
import { HEADERS } from "../constants/auth.constant.js";
import { AuthFailureError } from "../core/error.response.js";
import KeyStore from "../models/keyStore.model.js";

const authentication = async (req, res, next) => {
  try {
    const userId = req.headers[HEADERS.USERID];
    if (!userId) throw new AuthFailureError("Missing user ID");

    const keyStore = await KeyStore.findOne({ user_id: userId }).lean();
    if (!keyStore) throw new AuthFailureError("Credentials not found");

    const authorize = req.headers[HEADERS.AUTHORIZATION];
    if (!authorize) throw new AuthFailureError("Missing authorize information");
    const accessToken = authorize.split(" ")[1];
    if (!accessToken) throw new AuthFailureError("Missing access token");

    const decodeUser = verifyAccessToken(accessToken, keyStore.publickey);
    if (!decodeUser) throw new AuthFailureError("Invalid access token");

    req.user = decodeUser;

    next();
  } catch (error) {
    next(error);
    console.log(`Authentication error middleware: ${error.message}`);
  }
};

export { authentication };
