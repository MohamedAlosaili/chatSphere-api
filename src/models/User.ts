import mongoose, { ObjectId } from "mongoose";
import regex from "../utils/regex";

export interface User {
  _id: string | ObjectId;
  username: string;
  email: string;
  isOnline: boolean;
  locale: "ar" | "en";
  photo: string;
  createdAt: Date | string;
}

const UserSchema = new mongoose.Schema<User>(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      match: regex.validEmail,
      unique: true,
      lowercase: true,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    photo: {
      type: String,
      default: "default-photo.png",
    },
    locale: {
      type: String,
      enum: ["en", "ar"],
      default: "en",
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function (next) {
  if (this.isNew && !this.username) {
    const username = this.email.split("@")[0];

    this.username = username;
  }
  next();
});

export default mongoose.model<User>("User", UserSchema);
