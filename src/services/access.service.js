import { AuthFailureError } from "../core/error.response.js";
import User from "../models/user.model.js";
import { comparePassword, getInfoData, hashPassword } from "../utils/index.js";
import { handleTokens } from "../auth/jwt.auth.js";
import KeyStore from "../models/keyStore.model.js";

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

    const { tokens } = await handleTokens({
      userId: foundUser._id,
      userName: foundUser.user_name,
      email: foundUser.email,
    });

    return {
      userInfo: getInfoData(["_id", "user_name", "email"], newUser),
      tokens,
    };
  }

  static async signIn({ email, password }) {
    const foundUser = await User.findOne({ email });
    if (!foundUser)
      throw new AuthFailureError("User with email does not exist");

    const isPassword = await comparePassword(password, foundUser.password);

    if (!isPassword) throw new AuthFailureError("Credentials are invalid");

    const { tokens } = await handleTokens({
      userId: foundUser._id,
      userName: foundUser.user_name,
      email: foundUser.email,
    });

    return {
      user: getInfoData(["_id", "user_name", "email"], foundUser),
      tokens,
    };
  }

  static async signOut({ userId }) {
    const keyStore = await KeyStore.findOneAndDelete({
      user_id: userId,
    }).lean();
    if (!keyStore) throw new AuthFailureError("Error when delete key store");

    return keyStore;
  }

  static async refreshToken({ userId, rToken }) {
    if (!rToken) throw new AuthFailureError("Refresh token is required");

    const foundUser = await User.findOne({ _id: userId }).lean();
    if (!foundUser) throw new AuthFailureError("User not found");

    const foundKeyStore = await KeyStore.findOne({
      user_id: userId,
    }).lean();
    if (!foundKeyStore) throw new AuthFailureError("Credentials not found");

    const blackList = foundKeyStore.refresh_token;

    if (blackList.includes(rToken)) {
      await KeyStore.findOneAndDelete({ user_id: userId });
      throw new AuthFailureError(
        "Your account has been hacked, please sign in again!"
      );
    }

    const { tokens } = await handleTokens({
      userId: foundUser._id,
      userName: foundUser.user_name,
      email: foundUser.email,
    });

    await KeyStore.findOneAndUpdate(
      { user_id: userId },
      {
        $push: {
          refresh_token: rToken,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    return {
      userInfo: getInfoData(["_id", "user_name", "email"], foundUser),
      tokens,
    };
  }
}

export default AccessService;
