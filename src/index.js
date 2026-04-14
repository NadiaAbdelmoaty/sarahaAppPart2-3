import express from "express";
import bootstrab from "./app.controller.js";

const app = express();

bootstrab(app);

export default app;