import { BadRequestError } from "../core/error.response.js";
import KeyStore from "../models//keyStore.model.js";

class KeyStoreService {
  static async savePublicKey({ pKey, userId }) {
    const publicKeyString = pKey.toString();

    const newKey = await KeyStore.findOneAndUpdate(
      {
        user_id: userId,
      },
      {
        publickey: publicKeyString,
      },

      {
        upsert: true,
        new: true,
      }
    );

    if (!newKey) throw new BadRequestError("Error when saving public key");

    return newKey ? newKey.publickey : null;
  }
}

export default KeyStoreService;
