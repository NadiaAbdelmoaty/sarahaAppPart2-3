import { verifyToken } from "../utlits/security/token.service.js";
import userModel from "../../DB/models/userModel/userModel.js";
import * as db_service from "../../DB/db.service.js";
import revoketoken from "../../DB/models/userModel/revoketoken.js";
import { PREFIX, SECRET_KEY } from "../../../config/config.service.js";
import { decode } from "node:punycode";
import * as redisS from "../../DB/redis/redis.service.js";

export const aithentication = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new Error("token not exists");
  }
  const [prefix, token] = authorization.split(" ");
  if (prefix !== PREFIX) {
    throw new Error("invalid token prefix");
  }
// ----------------verifyToken-----------------------------
  const decoded = verifyToken({ token, secret_key: SECRET_KEY });
  if (!decoded || !decoded?.id) {
    throw new Error("invalid token");
  }
  const user = await db_service.findOne({
    model: userModel,
    filter: { _id: decoded.id },
  });
  if (!user) {
    throw new Error("email is not exists", { cause: 404 });
  }

  if (user?.credential?.getTime() > decoded.iat * 1000) {
    throw new Error(" token expired you logged out", { cause: 500 });
  }

  const revoktoken = await redisS.get(
    redisS.revoke_key({ userId: user._id, jti: decoded.jti }),
  );
  if (revoktoken) {
    throw new Error("token expired you logged out from this device", {
      cause: 500,
    });
  }
  req.myuser = user;
  req.decoded = decoded;
  next();
};
