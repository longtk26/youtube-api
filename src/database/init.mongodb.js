import mongoose from "mongoose";
import configMongodb from "../config/mongodb.config.js";

const {
  db: { host, port, name },
} = configMongodb;

const envDatabase = {
  dev: `mongodb://${host}:${port}/${name}`,
  pro: ``,
};

const connectString = envDatabase[process.env.NODE_ENV];

console.log(`Connecting to ${connectString}`);

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose.set("debug", true);
    mongoose.set("debug", { color: true });

    mongoose
      .connect(connectString)
      .then(() => {
        console.log("Connected to Mongodb");
      })
      .catch((error) => {
        console.log("Mongodb connection error", error);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

export default instanceMongodb;
