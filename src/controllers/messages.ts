import Message from "../models/Message";
import Member from "../models/Member";

import asyncHandler from "../middlewares/asyncHandler";
import ErrorResponse from "../utils/errorResponse";

// Types
import { Next, Req, Res } from "../types";

// @desc    Get room messages
// @route   GET /api/rooms/:roomId/messages
// access   Private
export const getRoomMessages = (req: Req, res: Res, next: Next) => {
  req.model = Message;
  req.filterQuery = { roomId: req.room!._id };
  req.populateQuery = [{ path: "senderId" }];

  next();
};

// @desc    Add message
// @route   POST /api/rooms/:roomId/messages
// access   Private
export const addNewMessage = asyncHandler(async (req, res, next) => {
  const { roomId } = req.params;
  const { uploadedFile: file, content } = req.body;

  const senderId = req.user!._id;

  // prevent none member
  const member = await Member.findOne({ memberId: senderId, roomId });

  if (!member) {
    return next(
      new ErrorResponse("Not allowed, you are not a member of this room", 403)
    );
  }

  const newMessage = {
    type: file?.url ? "file" : "text",
    senderId,
    content,
    file,
    roomId,
  };

  const message = await Message.create(newMessage);

  res.status(201).json({
    success: true,
    data: message,
    message: "Message has been sent successfully",
  });
});
