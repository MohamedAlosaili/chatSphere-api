import mongoose, { ObjectId } from "mongoose";

export interface TMessage {
  _id: string | ObjectId;
  type: "announcement" | "text" | "file";
  senderId?: string | ObjectId;
  content?: unknown;
  file?: {
    type: string;
    url: string;
  };
  roomId: string | ObjectId;
  createdAt: Date | string;
}

const FileSchema = new mongoose.Schema<TMessage["file"]>({
  type: {
    type: String,
    required: [true, "Add file type"],
  },
  url: {
    type: String,
    required: [true, "Add file url"],
  },
});

const MessageSchema = new mongoose.Schema<TMessage>(
  {
    type: {
      type: String,
      enum: {
        values: ["announcement", "text", "file"],
        message: "{VALUE} not supported as message type",
      },
      default: "text",
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: function (this: TMessage) {
        return this.type !== "announcement";
      },
    },
    content: {
      type: String,
      maxLength: [500, "Message content cannot be more than 500 characters"],
      trim: true,
      required: [
        function (this: TMessage) {
          return this.type !== "file";
        },
        "Add message content",
      ],
    },
    file: FileSchema,
    roomId: {
      type: mongoose.Types.ObjectId,
      ref: "Room",
      required: [true, "Add room id"],
    },
  },
  { timestamps: true }
);

export default mongoose.model<TMessage>("Message", MessageSchema);
