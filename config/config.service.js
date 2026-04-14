import dotenv from "dotenv"
import {resolve} from "node:path"
const NODE_ENV = process.env.NODE_ENV
let envPaths={
    development:".env.development",
    production:".env.production"
}
dotenv.config({path:resolve(`config/${envPaths[NODE_ENV]}`)})
export const Port = process.env.PORT ? +process.env.PORT : 3000;
export const DB_URI = process.env.DB_URI;
export const SALT_ROUNDS = process.env.SALT_ROUNDS ? +process.env.SALT_ROUNDS : 10;
export const SECRET_KEY = process.env.SECRET_KEY
export const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY
export const PREFIX= process.env.PREFIX
export const REDIS_URL = process.env.REDIS_URL
export const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS
export const PASSWORD = process.env.PASSWORD
export const WHITE_LIST = process.env.WHITE_LIST?.split(",") || []
