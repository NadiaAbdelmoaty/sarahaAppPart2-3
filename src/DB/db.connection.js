import mongoose from "mongoose";
import { DB_URI } from "../../config/config.service.js";

const MONGODB_URI = DB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const checkDBConnection = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log("connected to db...");
            return mongoose;
        }).catch((error) => {
            console.log("can't connect to db", error.message);
            cached.promise = null; // reset promise so next request can retry
            throw error;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
};
export default checkDBConnection;