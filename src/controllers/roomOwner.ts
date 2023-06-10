import Room from "../models/Room";
import Member from "../models/Member";
import User from "../models/User";
import Message from "../models/Message";

import asyncHandler from "../middlewares/asyncHandler";
import ErrorResponse from "../utils/errorResponse";
import validMembersToAdd from "../utils/validMembersToAdd";
import { isValidObjectId } from "mongoose";

// @desc    Update room info
// @route   PUT /api/rooms/:roomId/owner
// access   Private - only room onwers
export const updateRoomInfo = asyncHandler(async (req, res, next) => {
  const { roomId } = req.params;

  const { private: Private, name } = req.body;

  if (!Private && !name) {
    return res.status(200).json({
      success: true,
      data: req.room,
      message: "Nothing was changed.",
    });
  }

  const room = await Room.findByIdAndUpdate(
    roomId,
    { name, private: Private },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: room,
    message: `${room?.name} info updated`,
  });
});

// @desc    Update room photo
// @route   PUT /api/rooms/:roomId/owner/photo
// access   Private - only room onwers
export const updateRoomPhoto = asyncHandler(async (req, res, next) => {
  const { roomId } = req.params;

  if (!req.body.uploadedFile) {
    return res.status(200).json({
      success: true,
      data: req.room,
      message: "Nothing was changed.",
    });
  }

  const photo = req.body.uploadedFile.url;

  const room = await Room.findByIdAndUpdate(roomId, { photo }, { new: true });

  res.status(200).json({
    success: true,
    data: room,
    message: `${room?.name}'s photo updated`,
  });
});

// @desc    Add room moderators
// @route   PUT /api/rooms/:roomId/owner/moderators/:moderatorId
// access   Private - only room onwers
export const addModerator = asyncHandler(async (req, res, next) => {
  const { roomId, moderatorId } = req.params;

  // TODO: Check if the moderator is a member first

  if (!moderatorId) {
    return next(new ErrorResponse("Invalid request, missing moderatorId", 400));
  }

  if (moderatorId === req.user?._id.toString()) {
    return next(new ErrorResponse("Room owner cannot be a moderator", 400));
  }

  const newModeratorsArray = req.room!.moderators.map(mod => mod.toString());

  if (newModeratorsArray.includes(moderatorId)) {
    return res.status(200).json({
      success: true,
      data: req.room,
      message: "Nothing was changed.",
    });
  }

  newModeratorsArray.push(moderatorId);

  const room = await Room.findByIdAndUpdate(
    roomId,
    { moderators: newModeratorsArray },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: room,
    message: `Moderator added`,
  });
});

// @desc    Remove room moderators
// @route   DELETE /api/rooms/:roomId/owner/moderators/:moderatorId
// access   Private - only room onwers
export const removeModerator = asyncHandler(async (req, res, next) => {
  const { roomId, moderatorId } = req.params;

  if (!moderatorId) {
    return next(new ErrorResponse("Invalid request, missing moderatorId", 400));
  }

  const newModeratorsArray = req.room!.moderators.filter(
    mod => mod.toString() !== moderatorId
  );

  if (newModeratorsArray.length === 0) {
    return res.status(200).json({
      success: true,
      data: req.room,
      message: "Nothing was changed.",
    });
  }

  const room = await Room.findByIdAndUpdate(
    roomId,
    { moderators: newModeratorsArray },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: room,
    message: `Moderator removed`,
  });
});

// @desc    Add members
// @route   POST /api/rooms/:roomId/owner/members/add
// access   Private - only room onwers
export const addMembers = asyncHandler(async (req, res, next) => {
  const { members } = req.body as { members: string[] };

  const ownerId = String(req.user!._id);
  const roomId = String(req.room!._id);

  const result = await validMembersToAdd(members, ownerId, roomId, {
    checkRoomMembers: true,
  });

  if (!result.success) {
    return next(new ErrorResponse(result.error!, 400));
  }

  res.status(201).json({
    success: true,
    data: null,
    message: `${result.data} joined`,
  });
});

// @desc    Remove members
// @route   POST /api/rooms/:roomId/owner/members/remove
// access   Private - only room onwers
export const removeMembers = asyncHandler(async (req, res, next) => {
  const { members } = req.body as { members: string[] };

  const ownerId = String(req.user!._id);
  const roomId = String(req.room!._id);

  if (
    !Array.isArray(members) ||
    members.length === 0 ||
    !members.every(memberId => isValidObjectId(memberId))
  ) {
    const message =
      Array.isArray(members) && members.length > 0
        ? "One or more member IDs are invalid"
        : "Invalid/Missing members array";
    return next(new ErrorResponse(message, 400));
  }

  // Prevent removing room owner & Remove duplicates values
  const filteredMemberIds = Array.from(new Set(members)).filter(
    memberId => memberId !== ownerId
  );

  if (filteredMemberIds.length === 0) {
    return next(
      new ErrorResponse("Room owner cannot be removed from /owner route", 400)
    );
  }

  const [deletedMembers] = await Promise.all([
    User.find({ _id: { $in: filteredMemberIds } }),
    Member.deleteMany({ memberId: { $in: filteredMemberIds } }),
  ]);

  if (deletedMembers.length > 0) {
    const names = deletedMembers.map(member => member.username).join(", ");
    await Message.create({
      type: "announcement",
      content: `${names} removed`,
      roomId,
    });
  }

  res.status(200).json({
    success: true,
    data: null,
    message: "Members deleted successfully",
  });
});
