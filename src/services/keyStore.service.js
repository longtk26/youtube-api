import { BadRequestError } from "../core/error.response.js";
import KeyStore from "../models//keyStore.model.js";

class KeyStoreService {
  static async savePublicKey({ pKey, userId }) {
    const publicKeyString = pKey.toString();

    const newKey = await KeyStore.create({
      user_id: userId,
      publickey: publicKeyString,
    });

    if (!newKey) throw new BadRequestError("Error when saving public key");

    return newKey ? newKey.publickey : null;
  }
}

export default KeyStoreService;
