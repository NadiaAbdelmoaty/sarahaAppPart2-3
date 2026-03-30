import { EventEmitter } from "node:events";
import { eventEmailEnum } from "../../emun/email.enum.js";
export const eventEmmetter=new EventEmitter
eventEmmetter.on(eventEmailEnum.confirmeEmail,async(fn)=>{
await fn()
})