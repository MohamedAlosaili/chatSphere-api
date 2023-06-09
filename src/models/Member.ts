import mongoose, { ObjectId } from "mongoose";

export interface TMember {
  _id: string | ObjectId;
  memberId: string | ObjectId;
  roomId: string | ObjectId;
  createdAt: Date | string;
}

const MemberSchema = new mongoose.Schema<TMember>(
  {
    memberId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Add user id"],
    },
    roomId: {
      type: mongoose.Types.ObjectId,
      ref: "Room",
      required: [true, "Add room id"],
    },
  },
  { timestamps: true }
);

// Prevent adding member twice
MemberSchema.index({ memberId: 1, roomId: 1 }, { unique: true });

export default mongoose.model<TMember>("Member", MemberSchema);
