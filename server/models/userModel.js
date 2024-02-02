import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    imageUrl: String,
    accessLevel: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
