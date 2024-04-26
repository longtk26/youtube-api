import { Router } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";

import {
  configPassport,
  passportStrategy,
} from "../../config/passport.config.js";
import OauthService from "../../services/oauth.service.js";
import { AuthFailureError } from "../../core/error.response.js";
import { CLIENT_URL } from "../../constants/index.constant.js";

// Config passport

passportStrategy({
  Strategy: GoogleStrategy,
  strategyCallBack: OauthService.OauthGoogleStrategy,
  serviceType: "google",
});

// Serialize and deserialize
configPassport();

// Routers
const oauthRoute = Router();

oauthRoute.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
oauthRoute.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "login/failure",
  })
);
oauthRoute.get("/login/failure", (_, res) => {
  throw new AuthFailureError("Login failed by Oauth google");
});

export default oauthRoute;
