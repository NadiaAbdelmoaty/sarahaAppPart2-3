import express from "express";
import checkDBConnection from "./DB/db.connection.js";
import userModel from "./DB/models/userModel/userModel.js";
import userRouter from "./module/userModule/user.controller.js";
import cors from "cors";
import { Port, WHITE_LIST } from "../config/config.service.js";
import { connectingRedis, redis_client } from "./DB/redis/redisConnection.js";
import messageRouter from "./module/messageModule/message.controller.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const port = Port;

const bootstrab = async (app) => {
  const limiter = rateLimit({
    windowMs: 60 * 5 * 1000,
    limit: 3,
  });
  const corsOptions = {
    origin: function (origin, callback) {
      if ([...WHITE_LIST, undefined].includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("not allow by cors"));
      }
    },
  };

  app.use(cors(corsOptions), helmet(), /*limiter,*/ express.json());

  app.use("/uploads", express.static("uploads"));
  await checkDBConnection();
  await connectingRedis();
  app.use("/user", userRouter);
  app.use("/message", messageRouter);
  try {
    await redis_client.set("name", "nadia");
  } catch (err) {
    console.error("Redis set error:", err.message);
  }
  app.use((req, res, next) => {
    throw new Error(`no page with this URL ${req.originalUrl}`, { cause: 404 });
  });
  app.use((err, req, res, next) => {
    res
      .status(err.cause || 500)
      .json({ message: err.message, stack: err.stack });
  });
  app.listen(port, () => {
    console.log("hi from server");
  });
};
export default bootstrab;
