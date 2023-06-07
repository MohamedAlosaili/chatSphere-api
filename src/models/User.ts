import mongoose, { ObjectId } from "mongoose";
import regex from "../utils/regex";

export interface TUser {
  _id: string | ObjectId;
  username: string;
  email: string;
  isOnline: boolean;
  locale: "ar" | "en";
  photo: string;
  createdAt: Date | string;
}

const UserSchema = new mongoose.Schema<TUser>(
  {
    email: {
      type: String,
      required: true,
      match: regex.validEmail,
      unique: true,
      lowercase: true,
      select: false,
    },
    username: {
      type: String,
      default: function () {
        return this.email.split("@")[0];
      },
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

export default mongoose.model<TUser>("User", UserSchema);
