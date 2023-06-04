import mongoose from "mongoose";

interface User {
  name: string;
  username: string;
  email: string;
  isOnline: boolean;
  locale: "ar" | "en";
  photo: string;
}

const UserSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/,
      unique: true,
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

export default mongoose.model<User>("User", UserSchema);
