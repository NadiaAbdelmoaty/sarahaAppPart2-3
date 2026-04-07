import joi from "joi";
import { generaRules } from "../../common/utlits/generalRules.js";
export const sendMessageSchema = {
  body: joi
    .object({
      content: joi.string().required(),
      userId: generaRules.id.required(),
    })
    .required(),
  files: joi.array().items(generaRules.file),
};

export const getMessageSchema = {
  params: joi
    .object({
      messageId: generaRules.id.required(),
    })
    .required(),
  files: joi.array().items(generaRules.file),
};

export const getAllMessagesSchema = {
  params: joi
    .object({
      userId: generaRules.id.required(),
    })
    .required(),
};
