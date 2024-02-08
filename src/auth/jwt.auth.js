import jwt from "jsonwebtoken";

const createAccessAndRefreshToken = (payload, privateKey, publicKey) => {
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

export { createAccessAndRefreshToken, verifyAccessToken };
