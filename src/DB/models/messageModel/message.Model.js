import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      minLength: 1,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    attachments: [String],
  },
  {
    timestamps: true,
  },
);

const messageModel =
  mongoose.model.message || mongoose.model("message", messageSchema);
export default messageModel;
