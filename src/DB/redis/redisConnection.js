import { createClient } from "redis"
import { REDIS_URL } from "../../../config/config.service.js";

export const redis_client = createClient({
  url: REDIS_URL
});

redis_client.on("error", (err) => console.error("Redis Client Error:", err));

export const connectingRedis = async () => {
  try {
    await redis_client.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
};