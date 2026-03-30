import { providerEnum } from "../../../common/emun/user.enum.js";
import { successResponce } from "../../../common/utlits/response.success.js";
import {
  decrypt,
  encrypt,
} from "../../../common/utlits/security/encrypt.security.js";
import {
  compare,
  hash,
} from "../../../common/utlits/security/hash.security.js";
import {
  GenerateToken,
  verifyToken,
} from "../../../common/utlits/security/token.service.js";
import * as db_service from "../../db.service.js";
import userModel from "../../models/userModel/userModel.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { OAuth2Client } from "google-auth-library";
import joi from "joi";
import revoketoken from "../../models/userModel/revoketoken.js";
import { model } from "mongoose";
import {
  PREFIX,
  REFRESH_SECRET_KEY,
  SALT_ROUNDS,
  SECRET_KEY,
} from "../../../../config/config.service.js";
import {
  generateotp,
  sendingEmail,
} from "../../../common/utlits/email/sendEmail.js";
import cloudinary from "../../../common/utlits/cloudinary/cloudinary.js";
import { randomUUID } from "crypto";
import * as redisS from "../../redis/redis.service.js";
import { eventEmmetter } from "../../../common/utlits/email/email.event.js";
import { page } from "../../../common/utlits/email/endOtppage.js";



// ------------------sending OTP Global------------------
const sendEmailOTP = async (email) => {
  const isblocked = await redisS.ttl(redisS.blocked_otp_key({ email }));
  if (isblocked > 0) {
    throw new Error(`you are blocked try again after ${isblocked}`);
  }

  // if(isblocked==-2){
  //      await redisS.deleteKey(redisS.max_otp_key({email}))

  // }
  const timelifeForOTP = await redisS.ttl(redisS.otp_key({ email }));
  if (timelifeForOTP > 0) {
    throw new Error(`your otp still valid`);
  }

  const maxTries = await redisS.get(redisS.max_otp_key({ email }));
  if (maxTries >= 3) {
    await redisS.setvalue({
      key: redisS.blocked_otp_key({ email }),
      value: 1,
      ttl: 2 * 60,
    });
    throw new Error(`your are blocked now try again later `);
  }
  eventEmmetter.emit(eventEmailEnum.confirmeEmail, async () => {
    const OTP = await generateotp();
    await sendingEmail({
      to: email,
      subject: `verify your email `,
      html: page(OTP),
    });

    await redisS.setvalue({
      key: redisS.otp_key({ email }),
      value: hash({ plainText: `${OTP}` }),
      ttl: 60 * 60,
    });
    await redisS.incr(redisS.max_otp_key({ email }));
    await redisS.deleteKey(redisS.otp_key({ email }));
  });
};
// -------------- signUp --------------------------------------------
export const signUp = async (req, res, next) => {
  const { userName, email, password, gender, age, phone, confirmed, provider } =
    req.body;

  // console.log('before',req.file);

  if (await db_service.findOne({ model: userModel, filter: { email } })) {
    throw new Error("email alredy exists exists");
  }

  // //for array and filds multer
  // let paths = []
  // if(req.files.attachments){
  //   for(let file of req.files.attachments){
  //     paths.push(file.path)
  //   }
  // }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: "nadia/user",
      /// options
      // public_id:"nn",
      // use_filename:true,
      // unique_filename:false,
      // resource_type:"auto"
    },
  );
  // *********cloudinary upload

  const [firstName, ...lastNameParts] = userName.split(" ");
  const lastName = lastNameParts.length ? lastNameParts.join(" ") : firstName;

  const user = await db_service.create({
    model: userModel,
    data: {
      firstName,
      lastName,
      email,
      password: hash({ plainText: password, salt_rounds: SALT_ROUNDS }),
      gender,
      age,
      phone: encrypt(phone),
      confirmed,
      provider,
      // coverPicture:paths,
      credential: new Date(),
      profilePicture: { secure_url, public_id },
    },
  });
  // console.log('after',req.file);

  // ----------------------otp generating------------------
  eventEmmetter.emit(eventEmailEnum.confirmeEmail, async () => {
    const OTP = await generateotp();
    await sendingEmail({
      to: email,
      subject: "verify your email",
      html: page(OTP),
    });

    // console.log("hi redies")
    await redisS.setvalue({
      key: redisS.otp_key({ email }),
      value: hash({ plainText: `${OTP}` }),
      ttl: 60,
    });

    await redisS.setvalue({
      key: redisS.max_otp_key({ email }),
      value: 1,
      ttl: 30,
    });
  });

  successResponce({ res, status: 201, data: user });
};
// ------------------------confirmEmail-----------------------
export const confirmEmail = async (req, res, next) => {
  const { email, OTP } = req.body;
  const realotp = await redisS.get(redisS.otp_key({ email }));
  if (!realotp) {
    throw new Error(`otp not valid not found`);
  }
  if (!compare({ plainText: OTP, cipherText: realotp })) {
    throw new Error(`otp not valid`);
  }
  const user = await db_service.findOneAndUpdate({
    model: userModel,
    filter: {
      email,
      confirmed: { $exists: false },
      provider: providerEnum.system,
    },
    update: { confirmed: true },
  });
  if (!user) {
    throw new Error(`user not exists`);
  }

  // ************************* error here says no ttl for this key***********

  await redisS.deleteKey(redisS.otp_key({ email }));
  successResponce({
    res,
    message: "confirmeddddddddddddddddddddddddd 😊😊",
    status: 200,
  });
};

// -----------------------------------------resendConfirmEmail----------------------------------

export const resendConfirmEmail = async (req, res, next) => {
  const { email } = req.body;

  const user = await db_service.findOne({
    model: userModel,
    filter: {
      email,
      confirmed: { $exists: false },
      provider: providerEnum.system,
    },
  });
  // console.log(user)
  if (!user) {
    throw new Error(`user not exists`);
  }
  await sendEmailOTP(email);
  successResponce({
    res,
    message: "confirmeddddddddddddddddddddddddd again 😊😊",
    status: 200,
  });
};

// ----------------------------------------signUpwithemail-----------------------------
export const signUpwithemail = async (req, res, next) => {
  const { idToken } = req.body;
  //  console.log(idToken)

  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience:
      "943822216111-tbilu82gh1bdtikjkej73n20n5jiura1.apps.googleusercontent.com", // Specify the WEB_CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const { email, email_verified, name, picture } = payload;
  let user = await db_service.findOne({ model: userModel, filter: { email } });
  if (!user) {
    const [firstName, ...lastNameParts] = name.split(" ");
    const lastName = lastNameParts.length ? lastNameParts.join(" ") : firstName;

    user = await db_service.create({
      model: userModel,
      data: {
        email,
        confirmed: email_verified,
        firstName,
        lastName,
        profilePicture: picture,
        provider: providerEnum.google,
        credential: new Date(),
      },
    });
  }
  if (payload.provider == providerEnum.system) {
    throw new Error("please go to log in with system", { cause: 500 });
  }
  const access_token = GenerateToken({
    payload: { id: user._id, email: user.email },
    secret_key: SECRET_KEY,
  });
  successResponce({ res, data: access_token });
};

// ---------------------------------------------signIn-----------------------------
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await db_service.findOne({
    model: userModel,
    filter: { email, provider: providerEnum.system },
  });
  if (!user) {
    throw new Error("email is not exists", { cause: 404 });
  }

  if (!compare({ plainText: password, cipherText: user.password })) {
    throw new Error("password is not valid");
  }

  const jwtid = randomUUID();

  const access_token = GenerateToken({
    payload: { id: user._id, email: user.email },
    secret_key: SECRET_KEY,
    options: {
      expiresIn: 60 * 30,
      jwtid,
    },
  });
  const refresh_token = GenerateToken({
    payload: { id: user._id, email: user.email },
    secret_key: REFRESH_SECRET_KEY,
    options: {
      expiresIn: "1y",
      jwtid,
    },
  });

  // const aacess_token =jwt.sign({id:user._id,email:user.email},"nadia",{
  //    // expiresIn:60    // deadline
  //    // noTimestamp:true   // createdat
  //    // issuer:"http://locahost/3000" // who seds this token
  //    // audience:"http://localhost/4000"  who will receve this token
  //    // notBefore:60*60     //when will this token work after 1 hour
  //    // jwtid:uuidv4()   // add a random thing to the token to use it to revocke the token
  //    // npm uuid
  // })
  successResponce({ res, data: { access_token, refresh_token } });
};
// ---------------------------getProfile---------------------------------
export const getProfile = async (req, res, next) => {
  // // cashing
  const key = `profile::${req.myuser._id}`;
  const userExists = await redisS.get(key);
  if (userExists) {
    return successResponce({ res, data: userExists });
  }
  const profilevwiews = await redisS.incr({key:`views::${req.myuser._id}`,value:1,ttl:-1})
  await redisS.setvalue({ key, value: req.myuser, ttl: 60 });
  // const {id}=req.params

  // const decoded = jwt.verify(authorization,"nadia",{
  //    // ignoreExpiration:true   //to ingnore the expiration time
  // })

  successResponce({ res, data: req.myuser,message:`yiur views : ${profilevwiews}` });
  //  successResponce({res,data:{...user._doc,data:user}})
};

export const shareProfile = async (req, res, next) => {
  const { id } = req.params;
  const user = await db_service.findById({
    model: userModel,
    filter: id,
    select: "-password",
  });
  if (!user) {
    throw new Error("user not exists", { cause: 404 });
  }
  user.phone = decrypt(user.phone);

  successResponce({ res, data: user });
};
// export const hiadmin=()=>{
// console.log("hi admin")
// }
// export const hiuser=()=>{
// console.log("hi user")

// }
export const refresh_tokenAPI = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new Error("token not exists");
  }

  //  فى حالة زودنا كلمة سر عالتوكن
  const [prefix, token] = authorization.split(" ");
  if (prefix !== PREFIX) {
    throw new Error("invalid token prefix");
  }

  const decoded = verifyToken({ token, secret_key: REFRESH_SECRET_KEY });
  if (!decoded || !decoded?.id) {
    throw new Error("invalid token");
  }
  const user = await db_service.findOne({
    model: userModel,
    filter: { _id: decoded.id },
    select: "-password",
  });
  if (!user) {
    throw new Error("email is not exists", { cause: 404 });
  }
  const revoktoken = await db_service.findOne({
    model: revoketoken,
    filter: { tokenId: decoded.jti },
  });
  if (revoktoken) {
    throw new Error("token expired you logged out from this device", {
      cause: 500,
    });
  }
  const access_token = GenerateToken({
    payload: { id: user._id, email: user.email },
    secret_key: SECRET_KEY,
    options: {
      expiresIn: 60 * 60,
    },
  });
  successResponce({ res, data: access_token });
  //  successResponce({res,data:{...user._doc,data:user}})
};
// -------------------------updateProfile-----------------------------------
export const updateProfile = async (req, res, next) => {
  let { firstName, lastName, gender, phone } = req.body;
  if (phone) {
    phone = encrypt(phone);
  }
  const user = await db_service.findOneAndUpdate({
    model: userModel,
    filter: { _id: req.myuser._id },
    update: { firstName, lastName, gender, phone },
    options: { new: true, select: "-password" },
  });
  if (!user) {
    throw new Error("email is not exists", { cause: 404 });
  }
  await redisS.deleteKey(`profile::${req.myuser._id}`);
  successResponce({ res, data: user });
};
//-------------------------------updatePassword-------------------------
export const updatePassword = async (req, res, next) => {
  const { newPassword, oldPassword } = req.body;
  if (!compare({ plainText: oldPassword, cipherText: req.myuser.password })) {
    throw new Error("invalid old password", { cause: 404 });
  }
  const hashpass = hash({ plainText: newPassword, salt_rounds: SALT_ROUNDS });
  await req.myuser.save();

  successResponce({ res });
};
// ----------------------------------logOut-------------------------------
export const logout = async (req, res, next) => {
  const { flag } = req.query;
  if (flag == "all") {
    req.myuser.credential = new Date();
    await req.myuser.save();
    await redisS.deleteKey(
      await redisS.Keys(redisS.get_key({ userId: req.myuser._id })),
    );
    // await db_service.deleteMany({model:revoketoken,filter:{userId:req.myuser._id}
    // })
  } else {
    await redisS.setvalue({
      key: redisS.revoke_key({ userId: req.myuser._id, jti: req.decoded.jti }),
      value: `${req.decoded.jti}`,
      ttl: req.decoded.exp - Math.floor(Date.now() / 1000),
    });
    // await db_service.create({
    //   model:revoketoken,
    //   data:{
    //     tokenId:req.decoded.jti,
    //     userId:req.myuser._id,
    //     expireAt:new Date(req.decoded.exp * 1000),
    //   }

    // })
  }
  successResponce({ res });

  //  successResponce({res,data:{...user._doc,data:user}})
};
