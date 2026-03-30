import mongoose from "mongoose";
import { DB_URI } from "../../config/config.service.js";

const checkDBConnection=async()=>{
    try {
        await mongoose.connect(DB_URI);
    console.log(`connected to db ${DB_URI}`);
    } catch (error) {
         console.log("can't connecte to db");
    }
}
export default checkDBConnection