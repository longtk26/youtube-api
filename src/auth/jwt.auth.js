import jwt from "jsonwebtoken";
import crypto from "crypto";
import KeyStoreService from "../services/keyStore.service.js";

import { AuthFailureError } from "../core/error.response.js";

const createAccessAndRefreshToken = (payload, privateKey) => {
  try {
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(
      `Error when creating access and refresh token: ${error.message}`
    );
  }
};

const verifyAccessToken = (accessToken, publicKey) => {
  try {
    const decode = jwt.verify(accessToken, publicKey);
    return decode;
  } catch (error) {
    console.log(`Error when verifying access token: ${error.message}`);
  }
};

const handleTokens = async ({ userId, userName, email }) => {
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
    userId,
  });

  if (!pKeyString) throw new AuthFailureError("Error when saving public key");

  const tokens = createAccessAndRefreshToken(
    {
      userId,
      userName,
      email,
    },
    privateKey
  );

  return { tokens };
};

export { createAccessAndRefreshToken, verifyAccessToken, handleTokens };
