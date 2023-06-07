import mongoose, { ObjectId } from "mongoose";

export interface TRoom {
  _id: string | ObjectId;
  private: boolean;
  name: string;
  photo: string;
  roomOwner: string | ObjectId;
  lastMessage: undefined; // TODO: Update after adding Message model
  moderators: string[];
  createdAt: Date | string;
}

const RoomSchema = new mongoose.Schema<TRoom>(
  {
    private: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: [true, "Add room name"],
    },
    photo: {
      type: String,
      default: "default-room-photo.png",
    },
    roomOwner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      requried: true,
    },
    lastMessage: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    moderators: [
      {
        type: mongoose.Types.ObjectId,
        max: [5, "Moderators cannot be more than 5"],
      },
    ],
  },
  { timestamps: true }
);

// TODO: Add room owner as member pre save
// TODO: Cascade deleting related docs when the room removed
export default mongoose.model("Room", RoomSchema);
