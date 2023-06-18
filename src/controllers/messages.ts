import Room, { TRoom } from "../models/Room";
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

  const [message] = await Promise.all([
    Message.create(newMessage),
    Member.updateMany(
      {
        roomId,
        memberId: { $ne: req.user?._id },
      },
      { $inc: { unreadMessages: 1 } }
    ),
  ]);

  res.status(201).json({
    success: true,
    data: message,
    message: "Message has been sent successfully",
  });
});

// @desc    Update message
// @route   PUT /api/rooms/:roomId/messages/:messageId
// access   Private
export const updateMessage = asyncHandler(async (req, res, next) => {
  const { messageId } = req.params;
  const { content } = req.body;

  const currentUserId = String(req.user!._id);

  if (!messageId || !content) {
    return next(
      new ErrorResponse(
        `Invalid request, missing ${
          content ? "message id" : "new message content"
        }`,
        400
      )
    );
  }

  let message = await Message.findById(messageId);

  if (!message) {
    return next(new ErrorResponse("Message not found", 404));
  }

  if (message.senderId?.toString() !== currentUserId) {
    return next(
      new ErrorResponse("Not authorized to update this message", 401)
    );
  }

  message = await Message.findByIdAndUpdate(
    messageId,
    { content },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: message,
    message: "Message has been updated successfully",
  });
});

// @desc    Delete message
// @route   DELETE /api/rooms/:roomId/messages/:messageId
// access   Private
export const deleteMessage = asyncHandler(async (req, res, next) => {
  const { messageId } = req.params;

  if (!messageId) {
    return next(new ErrorResponse(`Invalid request, missing message id`, 400));
  }

  let message = await Message.findById(messageId);

  if (!message) {
    return next(new ErrorResponse("Message not found", 404));
  }

  const checkUser = authroizedToDeleteMessage(
    req.room!,
    String(message.senderId),
    String(req.user!._id)
  );

  if (!checkUser.authorized) {
    return next(new ErrorResponse(checkUser.error!, 401));
  }

  await message.deleteOne();

  res.status(200).json({
    success: true,
    data: null,
    message: "Message has been deleted successfully",
  });
});

const authroizedToDeleteMessage = (
  room: TRoom,
  senderId: string,
  currentUserId: string
) => {
  const authorized = { authorized: true, error: null };

  if (currentUserId === room.roomOwner.toString()) return authorized;

  const isAbleToDeleteMessage =
    room.moderators.includes(currentUserId) &&
    senderId !== room.roomOwner.toString();

  if (senderId !== currentUserId && !isAbleToDeleteMessage) {
    return {
      authorized: false,
      error: "Not authroized to delete this message",
    };
  } else {
    return authorized;
  }
};

// @desc    Get unread messages
// @route   GET /api/rooms/:roomId/messages/unread
// access   Private
export const getUnreadMessages = asyncHandler(async (req, res, next) => {
  const { roomId } = req.params;

  const member = await Member.findOne({ memberId: req.user?._id, roomId });

  if (!member) {
    return next(new ErrorResponse("Member not found", 404));
  }

  res.status(200).json({
    success: true,
    data: member.unreadMessages,
  });
});

// @desc    Reset unread messages
// @route   POST /api/rooms/:roomId/messages/unread
// access   Private
export const resetUnreadMessages = asyncHandler(async (req, res, next) => {
  const { roomId } = req.params;

  const member = await Member.findOneAndUpdate(
    { memberId: req.user?._id, roomId },
    {
      unreadMessages: 0,
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: member?.unreadMessages ?? 0,
  });
});
