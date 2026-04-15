import mongoose from "mongoose";
import { DB_URI } from "../../config/config.service.js";

const checkDBConnection = async () => {
    // 1 = connected
    if (mongoose.connection.readyState === 1) {
        return;
    }

    // 2 = connecting
    if (mongoose.connection.readyState === 2) {
        await mongoose.connection.asPromise();
        return;
    }

    try {
        await mongoose.connect(DB_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000, // Important for Vercel so it fails fast instead of hanging
            maxPoolSize: 10,
        });
        console.log(`connected to db...`);
    } catch (error) {
        console.log("can't connecte to db", error.message);
        throw error; // Throw so that Express error handler catches it, preventing routes from executing
    }
}
export default checkDBConnection;