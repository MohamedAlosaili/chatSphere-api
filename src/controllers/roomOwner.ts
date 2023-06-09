import Room from "../models/Room";

import asyncHandler from "../middlewares/asyncHandler";
import ErrorResponse from "../utils/errorResponse";

// @desc    Update room info
// @route   PUT /api/rooms/:roomId/owner
// access   Private
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
// access   Private
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
// access   Private
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
// access   Private
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