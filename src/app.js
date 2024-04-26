import compression from "compression";
import express from "express";
import passport from "passport";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import "dotenv/config";

import indexRoute from "./routes/index.js";

const app = express();

// init middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, //1 day
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// init dbs
import "./database/init.mongodb.js";

// init routes
app.use("/v1/api", indexRoute);

// handle errors

app.use((req, res, next) => {
  const err = new Error("Resources not found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    status: "Error",
    code: statusCode,
    message: err.message || "Internal Server Error",
  });
});

export default app;
