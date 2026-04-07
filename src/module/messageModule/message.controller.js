import { Router } from "express";
import { multer_local } from "../../common/middleware/multer.js";
import { validation } from "../../common/middleware/validation.js";
import { aithentication } from "../../common/middleware/authentication.js";
import * as MS from "../messageModule/message.service.js";
import * as Mv from "../messageModule/message.validation.js";
import { multer_enum } from "../../common/emun/multer.enum.js";

const messageRouter = Router({
  caseSensitive: true,
  strict: true,
  mergeParams: true,
});

messageRouter.post(
  "/send",
  multer_local({
    myPath: "messages",
    custom_types: multer_enum.image,
  }).array("attachments", 3),
  validation(Mv.sendMessageSchema),
  MS.sendMessage,
);
messageRouter.get(
  "/getOneMessage/:messageId",
  aithentication,
  validation(Mv.getMessageSchema),
  MS.getOneMessage,
);
messageRouter.get(
  "/getAllMessages/:userId",
  aithentication,
  validation(Mv.getAllMessagesSchema),
  MS.getAllMessages,
);

messageRouter.get(
  "/",
  aithentication,
  validation(Mv.getAllMessagesSchema),
  MS.getAllMessages,
);

export default messageRouter;
