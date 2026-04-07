import mongoose from "mongoose";
import {
  GenderEnum,
  providerEnum,
  roleEnum,
} from "../../../common/emun/user.enum.js";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
      trim: true,
    },

    credential: Date,

    lastName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
      trim: true,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider == providerEnum.google ? false : true;
      },
      minLength: 6,
      trim: true,
    },
    age: Number,
    gender: {
      type: String,
      enum: GenderEnum.value,
      default: GenderEnum.male,
    },
    profilePicture: {
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    coverPicture: [
      {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    confirmed: Boolean,
    provider: {
      type: String,
      enum: providerEnum.value,
      default: providerEnum.system,
    },
    role: {
      type: String,
      enum: roleEnum.value,
      default: roleEnum.user,
    },
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtual: true },
  },
);
userSchema
  .virtual("userName")

  .get(function () {
    return this.firstName + " " + this.lastName;
  })
  .set(function (v) {
    const [firstName, lastName] = v.split(" ");
    this.set({ firstName, lastName });
  });

const userModel = mongoose.model.user || mongoose.model("user", userSchema);
export default userModel;
