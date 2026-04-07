import { successResponce } from "../../common/utlits/response.success.js";
import * as db_service from "../../DB/db.service.js";
import messageModel from "../../DB/models/messageModel/message.Model.js";
import userModel from "../../DB/models/userModel/userModel.js";

export const sendMessage = async (req, res, next) => {
  const { content, userId } = req.body;

  const user = await db_service.findById({
    model: userModel,
    filter: {
      _id: userId,
    },
  });

  if (!user) {
    throw new Error("invalid Id , this user not exists");
  }

  let arr = [];
  if (req.files.length) {
    for (const file of req.files) {
      arr.push(file.path);
    }
  }
  const message = await db_service.create({
    model: messageModel,
    data: {
      content,
      userId: user._id,
      attachments: arr,
    },
  });

  successResponce({ res, status: 201, data: message });
};

export const getOneMessage = async (req, res, next) => {
  const { messageId } = req.params;

  const user = await db_service.findById({
    model: userModel,
    filter: {
      _id: req.myuser._id,
    },
  });

  if (!user) {
    throw new Error("invalid Id , this user not exists");
  }
  const oneMessage = await db_service.findById({
    model: messageModel,
    filter: {
      _id: messageId,
    },
  });
  if (!oneMessage) {
    throw new Error("no message for this id");
  }
  successResponce({ res, status: 201, data: oneMessage });
};

export const getAllMessages = async (req, res, next) => {
  const { userId } = req.params;

  const user = await db_service.findById({
    model: userModel,
    filter: {
      _id: userId,
    },
  });
  if (!user) {
    throw new Error("invalid Id , this user not exists");
  }
  const allMessages = await db_service.find({
    model: messageModel,
    filter: {
      userId: req.myuser._id,
    },
  });

  if (!allMessages) {
    throw new Error("no messages for this user");
  }
  successResponce({ res, status: 201, data: allMessages });
};
