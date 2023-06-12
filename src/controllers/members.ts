import Room from "../models/Room";
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

  // To add members on a private room, you must be the room owner
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

// @desc    Left from the room
// @route   DELETE /api/rooms/:roomId/leave
// access   Private
export const leftRoom = asyncHandler(async (req, res, next) => {
  const { roomId } = req.params;

  const room = req.room!;
  const ownerId = String(room.roomOwner);
  const user = req.user!;
  const userId = String(req.user!._id);

  const updateRoomOnwer = [];
  // Replacing the owner ...
  if (userId === ownerId) {
    let newRoomOwner = room.moderators?.[0]?.toString();
    let roomModerators = room.moderators;

    if (newRoomOwner) {
      // Remove the new king from the moderators
      roomModerators = roomModerators.filter(
        moderatorId => String(moderatorId) !== newRoomOwner
      );
    } else {
      // If there is no moderators make the second member the newRoomOwner
      const members = await Member.find({ roomId }).limit(2).sort("createdAt");
      if (members.length > 1) {
        newRoomOwner = String(members[1].memberId);
      }
    }

    const changeToPrivateIfNoMembersLeft = newRoomOwner
      ? {}
      : { private: true };
    updateRoomOnwer.push(
      Room.updateOne(
        { _id: roomId },
        {
          roomOwner: newRoomOwner,
          moderators: roomModerators,
          ...changeToPrivateIfNoMembersLeft,
        }
      )
    );
  }

  const [deleteResult] = await Promise.all([
    Member.deleteOne({ memberId: userId, roomId }),
    ...updateRoomOnwer,
  ]);

  if (deleteResult.deletedCount > 0) {
    await Message.create({
      type: "announcement",
      content: `${user.username} left`,
      roomId,
    });
  } else {
    return next(
      new ErrorResponse("Invalid request, user not joined this room", 400)
    );
  }

  res.status(200).json({
    success: true,
    data: null,
    message: "The user has successfully left the room",
  });
});
