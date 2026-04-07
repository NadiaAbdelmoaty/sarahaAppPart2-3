import joi from "joi";
import mongoose from "mongoose";

export const generaRules = {
  email: joi.string().email({ tlds: true }),
  password: joi
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    )
    .messages({ "any.required": "pass must be here" }),
  cPassword: joi.string().valid(joi.ref("password")),
  file: joi
    .object({
      fieldname: joi.string().required(),
      originalname: joi.string().required(),
      encoding: joi.string().required(),
      mimetype: joi.string().required(),
      destination: joi.string().required(),
      filename: joi.string().required(),
      path: joi.string().required(),
      size: joi.number().required(),
    })
    .messages({ "any.required": "file is required hi" }),
  id: joi.string().custom((value, helper) => {
    const isvalid = mongoose.Types.ObjectId.isValid(value);
    return isvalid ? value : helper.message("invalid id");
  }),
};
