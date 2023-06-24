import Room from "../models/Room";

import asyncHandler from "../middlewares/asyncHandler";
import validMembersToAdd from "../utils/validMembersToAdd";
import {
  availableRoomsPipeline,
  currentUserRoomsPipeline,
} from "../utils/pipelines";

// Types
import { Next, Req, Res } from "../types";

// @desc    Get all available rooms - public rooms
// @route   GET /api/rooms
// access   Private
export const getAvailableRooms = (req: Req, res: Res, next: Next) => {
  req.model = Room;
  req.pipeline = availableRoomsPipeline(req.user!._id);

  next();
};

// @desc    Get current user rooms
// @route   GET /api/rooms/joined
// access   Private
export const getCurrentUserRooms = (req: Req, res: Res, next: Next) => {
  req.model = Room;
  req.pipeline = currentUserRoomsPipeline(req.user!._id);

  next();
};

// @desc    Get single room
// @route   GET /api/rooms/:roomId
// access   Private
export const getRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.room?._id).populate("roomOwner");

  res.status(200).json({
    success: true,
    data: room,
  });
});

// @desc    Create new room
// @route   POST /api/rooms
// access   Private
export const createRoom = asyncHandler(async (req, res, next) => {
  const { uploadedFile, members, ...body } = req.body;

  body.photo = uploadedFile?.url;
  body.roomOwner = req.user!._id;

  const room = await Room.create(body);

  let error;
  if (members) {
    error = (
      await validMembersToAdd(
        members,
        String(req.user?._id),
        String(room._id),
        { simpleErrorMessage: true }
      )
    ).error;
  }

  res.status(201).json({
    success: true,
    data: room,
    message: `'${room.name}' room created${error ? `, but ${error}` : ""}`,
  });
});
