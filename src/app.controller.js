
import express from "express"
import checkDBConnection from "./DB/db.connection.js"
import userModel from "./DB/models/userModel/userModel.js"
import userRouter from "./DB/module/userModule/user.controller.js"
import cors from "cors"
import { Port } from "../config/config.service.js"
import { connectingRedis, redis_client } from "./DB/redis/redisConnection.js"



const app=express()
const port = Port

const bootstrab=async()=>{
app.use(cors(),express.json())
app.use("/uploads",express.static("uploads"))
checkDBConnection()
connectingRedis()
app.use("/user",userRouter)
 await redis_client.set("name","nadia")
app.use((req,res,next)=>{
   throw new Error(`no page with this URL ${req.originalUrl}`,{cause:404})

    // res.status(404).json({message:`no page with this URL ${req.originalUrl}`})
})
app.use((err,req,res,next)=>{
    res.status(err.cause||500).json({message:err.message,stack:err.stack})
})
app.listen(port,()=>{
        console.log("hi from server")
    })




}
export default bootstrab