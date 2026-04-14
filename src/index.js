import express from "express";
import bootstrab from "./app.controller.js";
import { sendingEmail } from "./common/utlits/email/sendEmail.js";
import { resolve } from "node:path";
const app = express();

await bootstrab(app);

export default app;