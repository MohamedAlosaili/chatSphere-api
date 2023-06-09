import Room from "../models/Room";

import ErrorResponse from "../utils/errorResponse";
import asyncHandler from "./asyncHandler";

// Types
import { Next, Req, Res } from "../types";

export const checkRoomExistence = asyncHandler(async (req, res, next) => {
  const { roomId } = req.params;

  if (!roomId) {
    return next(new ErrorResponse("Invalid request, missing room id", 400));
  }

  const room = await Room.findById(roomId);

  if (!room) {
    return next(new ErrorResponse("Room not found", 404));
  }

  req.room = room;

  next();
});

// @desc    Room can only modified by the owner
// @route   PUT, POST, DELETE /api/rooms/:roomId/*
// access   Private
export const isRoomOwner = (req: Req, res: Res, next: Next) => {
  if (req.user!._id.toString() !== req.room!.roomOwner.toString()) {
    return next(new ErrorResponse("Not authorized to modify this room", 403));
  }

  next();
};
