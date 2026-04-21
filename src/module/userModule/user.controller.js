import { Router } from "express";
import * as US from "./user.service.js";
import { aithentication } from "../../common/middleware/authentication.js";
import { authorisation } from "../../common/middleware/authorisation.js"
// import { authorisation } from "../../../common/middleware/authorisation.js";
import { roleEnum } from "../../common/emun/user.enum.js";
import { validation } from "../../common/middleware/validation.js";
import * as UVS from "./user.validation.js";
import {
  multer_local,
  multer_host,
} from "../../common/middleware/multer.js";
import { multer_enum } from "../../common/emun/multer.enum.js";
import messageRouter from "../messageModule/message.controller.js";
const userRouter = Router({ caseSensitive: true, strict: true });


userRouter.get("/", (req, res) => {
  res.json({ message: "Saraha API is running 🚀", status: "ok" });
});


// --------------------- user can get his messages -----------------------------
userRouter.use("/:userId/messages", messageRouter);

// --------------------- signUp-----------------------------



userRouter.post(
  "/signUp",
  //multer_host(multer_enum.image).single("attachment"),
  //validation(UVS.signUpschema),
  US.signUp,
);

// ------------------- signUp with Gmail -----------------------
userRouter.post("/signup/gmail", US.signUpwithemail);
// ------------------- signIn -----------------------

userRouter.get("/signIn", validation(UVS.signInschema), US.signIn);
userRouter.get(
  "/profile",
  aithentication,
  /*authorisation([roleEnum.user]),*/ US.getProfile,
);
// ------------------- Refresh_tokenAPI -----------------------
userRouter.get("/refresh_tokenAPI", US.refresh_tokenAPI);
// ------------------- share Profile -----------------------
userRouter.get(
  "/shareProfile/:id",
  validation(UVS.sharePrifileschema),
  US.shareProfile,
);
// ------------------- Update Profile -----------------------
userRouter.patch(
  "/updateProfile",
  aithentication,
  validation(UVS.updateProfileSchema),
  US.updateProfile,
);
// ------------------- Update password -----------------------

userRouter.patch(
  "/updatePassword",
  aithentication,
  validation(UVS.updatePasswordSchema),
  US.updatePassword,
);

// ------------------- confirm Email -----------------------

userRouter.patch(
  "/confirmEmail",
  validation(UVS.confirmEmailSchema),
  US.confirmEmail,
);
// ------------------- Resend confirm email  -----------------------
userRouter.patch(
  "/resendConfirmEmail",
  validation(UVS.resendconfirmEmailSchema),
  US.resendConfirmEmail,
);
// ------------------- forget password -----------------------
userRouter.patch(
  "/forgetpassword",
  validation(UVS.emailGeneralSchema),
  US.forgetpassword,
);
// ------------------- reset passwird -----------------------
userRouter.patch(
  "/resetPssword",
  validation(UVS.resetPasswordSchema),
  US.resetPssword,
);
// ------------------- Logout  -----------------------
userRouter.post("/logout", aithentication, US.logout);

export default userRouter;
