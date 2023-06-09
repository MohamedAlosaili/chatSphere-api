import Member from "../models/Member";
import Message from "../models/Message";

import asyncHandler from "../middlewares/asyncHandler";
import ErrorResponse from "../utils/errorResponse";

// Types
import { Next, Req, Res } from "../types";

// @desc    Get room members
// @route   GET /api/rooms/:roomId/members
// access   Private
export const getRoomMembers = (req: Req, res: Res, next: Next) => {
  const { roomId } = req.params;

  req.model = Member;
  req.filterQuery = { roomId };
  req.populateQuery = [{ path: "memberId" }];

  next();
};

// @desc    Join to a public room - (private rooms by the owner)
// @route   POST /api/rooms/:roomId/join
// access   Private
export const joinRoom = asyncHandler(async (req, res, next) => {
  const { roomId } = req.params;

  const room = req.room!;
  const user = req.user!;

  // To add members on a private room, you must be the roomOwner
  if (room.private) {
    return next(new ErrorResponse("Not authorized to join this room", 403));
  }

  await Promise.all([
    Member.create({ memberId: user._id, roomId }),
    Message.create({
      type: "announcement",
      content: `${user.username} joined`,
      roomId,
    }),
  ]);

  res.status(201).json({
    success: true,
    data: null,
    message: `Joined to ${room.name}`,
  });
});
