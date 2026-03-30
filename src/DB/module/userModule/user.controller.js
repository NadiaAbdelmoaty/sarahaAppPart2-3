import { Router } from "express";
import * as US from "./user.service.js"
import { aithentication } from "../../../common/middleware/authentication.js";
import { authorisation } from "../../../common/middleware/authorisation.js";
import { roleEnum } from "../../../common/emun/user.enum.js";
import { validation } from "../../../common/middleware/validation.js";
import * as UVS from "./user.validation.js";
import { multer_local,multer_host } from "../../../common/middleware/multer.js";
import { multer_enum } from "../../../common/emun/multer.enum.js";
const userRouter=Router()


// // ******how to send one or many files
// userRouter.post("/signUp",multer_local({custom_types:[...multer_enum.image,...multer_enum.pdf]})
// .fields([
//     {name:"attachments",maxCount:2},
//     {name:"attachment",maxCount:1}

// ])/*,validation(UVS.signUpschema)*/,US.signUp)


// // ******how to send one img with multer and clodinary and be inmy local also

// userRouter.post("/signUp",multer_local({custom_types:[...multer_enum.image,...multer_enum.pdf]})
// .single("attachment")/*,validation(UVS.signUpschema)*/,US.signUp)


userRouter.post("/signUp",multer_host(multer_enum.image)
.single("attachment"),validation(UVS.signUpschema),US.signUp)


userRouter.post("/signup/gmail",US.signUpwithemail)

userRouter.get("/signIn",validation(UVS.signInschema),US.signIn)
userRouter.get("/profile",aithentication,/*authorisation([roleEnum.user]),*/US.getProfile)
userRouter.get("/refresh_tokenAPI",US.refresh_tokenAPI)
userRouter.get("/shareProfile/:id",validation(UVS.sharePrifileschema),US.shareProfile)
userRouter.patch("/updateProfile",aithentication,validation(UVS.updateProfileSchema),US.updateProfile)

userRouter.patch("/updatePassword",aithentication,validation(UVS.updatePasswordSchema),US.updatePassword)

userRouter.patch("/confirmEmail",validation(UVS.confirmEmailSchema),US.confirmEmail)
userRouter.patch("/resendConfirmEmail",validation(UVS.resendconfirmEmailSchema),US.resendConfirmEmail)




userRouter.post("/logout",aithentication,US.logout)





export default userRouter