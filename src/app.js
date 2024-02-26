import compression from "compression";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import fileUpload from "express-fileupload";
import "dotenv/config";
import indexRoute from "./routes/index.js";

const app = express();

// init middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(fileUpload({ useTempFiles: true }));
app.use(helmet());
app.use(compression());
app.use(cors());

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
