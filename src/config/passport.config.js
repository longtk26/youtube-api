import passport from "passport";
import { SERVER_URL } from "../constants/index.constant.js";

const configPassport = () => {
  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      cb(null, user);
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });
};

const passportStrategy = ({
  Strategy,
  strategyCallBack,
  serviceType = "google",
}) => {
  passport.use(
    new Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${SERVER_URL}/oauth/${serviceType}/callback`,
      },
      strategyCallBack
    )
  );
};

export { configPassport, passportStrategy };
