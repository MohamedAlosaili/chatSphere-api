import mongoose, { ObjectId } from "mongoose";

export interface TRoom {
  _id: string | ObjectId;
  private: boolean;
  name: string;
  photo: string;
  roomOwner: string | ObjectId;
  lastMessage: string | ObjectId; // TODO: Update after adding Message model
  moderators: string[];
  updatedAt: Date | string; // To sort documents based on last message time
  createdAt: Date | string;
}

const RoomSchema = new mongoose.Schema<TRoom>({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add room owner as a member on room creation
RoomSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      await this.$model("Member").create({
        memberId: this.roomOwner,
        roomId: this._id,
      });
    } catch (err) {
      next(err as any);
    }
  }
});

// TODO: Cascade deleting related docs when the room removed
export default mongoose.model("Room", RoomSchema);
