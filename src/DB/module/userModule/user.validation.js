import joi from "joi";
import { GenderEnum } from "../../../common/emun/user.enum.js";
import { generaRules } from "../../../common/utlits/generalRules.js";

export const signUpschema = {
  body: joi.object({
    //                        a-z or 0-9 except spesial characters
    userName: joi.string().alphanum().insensitive().min(3).max(40).required(),
    email: generaRules.email.required(),
    password: generaRules.password.required(),
    age: joi.number().positive().integer().required(),
    cPassword: generaRules.cPassword.required(),
    gender: joi.string().valid(...Object.values(GenderEnum)).required(),
    DOB: joi.date(),
    phone: joi.string()
    //users:joi.array().items(joi.string(),joi.number()).lrnght(2).required()
    //users:joi.array().ordered(joi.string(),joi.number()).lrnght(2).required() //=> first must be string
    //users:joi.array().items(joi.object({}))  //=> array of object
    // .precision()   تقريب الرقم
  }).required(), //.options({presence:"required"}) //=> all is required
  // .with("password","cpassword") //=> you must send this two together
  // .or("password","cpassword") //=> send one or two it's ok
  // .xor("password","cpassword") //=> send first or second not the two things
  //

// ******************** multer options *************************

 // // *********** using single in multer you will find it inside generalRules File

  file: generaRules.file.required(),
// // ******************  using array in multer we can add it as will in generalRules file

//   files:joi.array().items({
//     fieldname: joi.string().required(),
//     originalname: joi.string().required(),
//     encoding: joi.string().required(),
//     mimetype: joi.string().required(),
//     destination: joi.string().required(),
//     filename: joi.string().required(),
//     path: joi.string().required(),
//     size: joi.number().required(),
//   }).required().messages({ 'any.required': "files is required" }),

// //  ********************* using fields in multer

  // files:joi.object({

  //   attachment:joi.array().items({
  //   fieldname: joi.string().required(),
  //   originalname: joi.string().required(),
  //   encoding: joi.string().required(),
  //   mimetype: joi.string().required(),
  //   destination: joi.string().required(),
  //   filename: joi.string().required(),
  //   path: joi.string().required(),
  //   size: joi.number().required(),
  // }).required().messages({ 'any.required': "attachment is required" }),

  // attachments:joi.array().items({
  //   fieldname: joi.string().required(),
  //   originalname: joi.string().required(),
  //   encoding: joi.string().required(),
  //   mimetype: joi.string().required(),
  //   destination: joi.string().required(),
  //   filename: joi.string().required(),
  //   path: joi.string().required(),
  //   size: joi.number().required(),
  // }).required().messages({ 'any.required': "attachments is required" }),
  // })
};



export const signInschema = {
  body: joi.object({
    email: generaRules.email.required(),
    password: generaRules.password.required(),
  })
    .required(),
  // query: joi.object({
  //   x: joi.number().min(3).max(40).required(),
  // })
  // .required(),
};
export const sharePrifileschema = {
  params: joi.object({
   id:generaRules.id.required()
  }).required()

};



export const updateProfileSchema = {
  body: joi.object({
   firstName: joi.string().alphanum().insensitive().min(3).max(40),
   lastName: joi.string().alphanum().insensitive().min(3).max(40),
   gender: joi.string().valid(...Object.values(GenderEnum)),
   phone: joi.string()
  }).required()

};
export const updatePasswordSchema = {
  body: joi.object({
  newPassword:generaRules.password.required(),
  oldPassword:generaRules.password.required(),
  cpassword:joi.string().valid(joi.ref("newPassword")),
  }).required()

};

// *************************
export const confirmEmailSchema = {
    body: joi.object({
        email: generaRules.email.required(),
        OTP: joi.string().regex(/^\d{6}$/).required(),
    }).required()
};
export const resendconfirmEmailSchema = {
    body: joi.object({
        email: generaRules.email.required()
      
    }).required()
};