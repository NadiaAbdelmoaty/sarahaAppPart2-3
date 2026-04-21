import joi from "joi";
// import { GenderEnum } from "../../../common/emun/user.enum.js";
import { GenderEnum } from "../../../src/common/emun/user.enum.js";

import { generaRules } from "../../common/utlits/generalRules.js";


// ******************** SignUp Uchema *************************
export const signUpschema = {
  body: joi
    .object({
      userName: joi.string().alphanum().insensitive().min(3).max(40).required(),
      email: generaRules.email.required(),
      password: generaRules.password.required(),
      age: joi.number().positive().integer().required(),
      cPassword: generaRules.cPassword.required(),
      gender: joi
        .string()
        .valid(...Object.values(GenderEnum))
        .required(),
      DOB: joi.date(),
      phone: joi.string(),
    })
    .required(),

  // ----------- multer options ---------------
  // file: generaRules.file.required(),
};

// ******************** SignIn Schema *************************
export const signInschema = {
  body: joi
    .object({
      email: generaRules.email.required(),
      password: generaRules.password.required(),
    })
    .required(),
};

// ******************** Share Prifile Schema *************************
export const sharePrifileschema = {
  params: joi
    .object({
      id: generaRules.id.required(),
    })
    .required(),
};

// ******************** Update Profile Schema *************************
export const updateProfileSchema = {
  body: joi
    .object({
      firstName: joi.string().alphanum().insensitive().min(3).max(40),
      lastName: joi.string().alphanum().insensitive().min(3).max(40),
      gender: joi.string().valid(...Object.values(GenderEnum)),
      phone: joi.string(),
    })
    .required(),
};

// ******************** Update Password Schema *************************
export const updatePasswordSchema = {
  body: joi
    .object({
      newPassword: generaRules.password.required(),
      oldPassword: generaRules.password.required(),
      cpassword: joi.string().valid(joi.ref("newPassword")),
    })
    .required(),
};

// ******************** Confirm Email Schema *************************
export const confirmEmailSchema = {
  body: joi
    .object({
      email: generaRules.email.required(),
      OTP: joi
        .string()
        .regex(/^\d{6}$/)
        .required(),
    })
    .required(),
};
// ******************** Resend Confirm Email Schema *************************
export const resendconfirmEmailSchema = {
  body: joi
    .object({
      email: generaRules.email.required(),
    })
    .required(),
};
// ******************** Email General Schema *************************
export const emailGeneralSchema = {
  body: joi
    .object({
      email: generaRules.email.required(),
    })
    .required(),
};

// ******************** Reset Password Schema *************************
export const resetPasswordSchema = {
  body: joi
    .object({
      code: joi
        .string()
        .regex(/^\d{6}$/)
        .required(),
      email: generaRules.email.required(),
      newPassword: generaRules.password.required(),
      cpassword: joi.string().valid(joi.ref("newPassword")),
    })
    .required(),
};
