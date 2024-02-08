import crypto from "crypto";

import { AuthFailureError } from "../core/error.response.js";
import User from "../models/user.model.js";
import { getInfoData, hashPassword } from "../utils/index.js";
import KeyStoreService from "./keyStore.service.js";
import { createAccessAndRefreshToken } from "../auth/jwt.auth.js";

class AccessService {
  static async signUp({ user_name, email, password }) {
    const foundUser = await User.findOne({ email }).lean();
    if (foundUser) throw new AuthFailureError("User with email already exists");

    const newUser = await User.create({
      email,
      user_name,
      password: await hashPassword(password),
    });

    if (!newUser) throw new AuthFailureError("Error when create new user");

    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });

    const pKeyString = await KeyStoreService.savePublicKey({
      pKey: publicKey,
      userId: newUser._id,
    });

    if (!pKeyString) throw new AuthFailureError("Error when saving public key");
    const pKeyObject = crypto.createPublicKey(pKeyString);

    const tokens = createAccessAndRefreshToken(
      {
        userId: newUser._id,
        userName: newUser.user_name,
        email: newUser.email,
      },
      privateKey,
      pKeyObject
    );

    return {
      userInfo: getInfoData(["_id", "user_name", "email"], newUser),
      tokens,
    };
  }
}

export default AccessService;
