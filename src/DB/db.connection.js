import mongoose from "mongoose";
import { DB_URI } from "../../config/config.service.js";

const checkDBConnection=async()=>{
    try {
        await mongoose.connect(DB_URI);
        console.log(`connected to db successfully!`);
    } catch (error) {
        console.log("can't connect to db", error);
    }
}
export default checkDBConnection