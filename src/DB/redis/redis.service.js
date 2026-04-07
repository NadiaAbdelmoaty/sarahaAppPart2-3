import { eventEmailEnum } from "../../common/emun/email.enum.js";
import  { redis_client } from "./redisConnection.js";


export const revoke_key=({userId,jti})=>{
    return `revoke_token::${userId}::${jti}`
}
export const get_key=({userId})=>{
    return `revoke_token::${userId}`
}
export const otp_key=({email,subject=eventEmailEnum.confirmeEmail})=>{
    return `otp::${email}::${subject}`
}
export const max_otp_key=({email})=>{
    return `max_otp::${email}`
}
export const blocked_otp_key=({email})=>{
    return `blocked_otp::${email}`
}

// set
export const setvalue = async({key,value,ttl})=>{
    try {
        const data = typeof value == "string"?value :JSON.stringify(value)
        return ttl? await redis_client.set(key,data , {EX:ttl}):await redis_client.set(key,data)
    } catch (error) {
        console.log(" error set cash ",error)
        
    }
}

// update
export const update = async({key,value,ttl})=>{
    try {
        if (!await redis_client.exists(key)) return 0
        return await setvalue({key,value,ttl})
    } catch (error) {
        console.log(" error update cash ",error)
        
    }
}

// get
export const get = async(key)=>{
    try {
        try {
            return JSON.parse(await redis_client.get(key))
        } catch (error) {
            return await redis_client.get(key)
        }
    } catch (error) {
        console.log(" error get cash ",error)
        
    }
}

// ttl
export const ttl = async(key)=>{
    try {
            return await redis_client.ttl(key)

    } catch (error) {
        console.log(" error ttl cash ",error)
       
    }

}

// exists
export const exists = async(key)=>{
    try {
            return await redis_client.exists(key)

    } catch (error) {
        console.log(" error exists cash ",error)
       
    }
}

// expire

export const expire = async({key,ttl})=>{
    try {
            return await redis_client.expire(key,ttl)

    } catch (error) {
        console.log(" error expire cash ",error)
       
    }

}

// deleteKey
export const deleteKey = async(key)=>{
    try {
        if(!key.length) return 0
            return await redis_client.del(key) 

    } catch (error) {
        console.log(" error delete cash ",error)
       
    }

}

// keys
export const Keys = async(key)=>{
    try {
        
            return await redis_client.keys(`${key}*`) 

    } catch (error) {
        console.log(" error keys cash ",error)
       
    }

}


// incr

export const incr = async ({ key, value }) => { // لازم تحط الأقواس دي هنا
    try {
        if (!key) throw new Error("Redis Key is required");
        const incrementAmount =value;
        return await redis_client.incrBy(key, incrementAmount); 
    } catch (error) {
        console.log("error incr cash:", error.message);
        return 0;
    }
};