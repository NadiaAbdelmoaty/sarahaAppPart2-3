import mongoose from "mongoose";

const revoketokenSchema = mongoose.Schema(
  {
    tokenId: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
    },

    // role:
  },
  {
    timestamps: true,
    strictQuery: true,
  },
);

revoketokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const revoketokenModel =
  mongoose.model.revoketoken ||
  mongoose.model("revoketoken", revoketokenSchema);
export default revoketokenModel;
