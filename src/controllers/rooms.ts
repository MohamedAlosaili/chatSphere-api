import Room from "../models/Room";
import Member from "../models/Member";

import asyncHandler from "../middlewares/asyncHandler";

// Types
import { Next, Req, Res } from "../types";
import { Aggregate, PipelineStage } from "mongoose";

// @desc    Get all available rooms - public rooms
// @route   GET /api/rooms
// access   Private
export const getAvailableRooms = (req: Req, res: Res, next: Next) => {
  req.model = Room;
  req.filterQuery = { private: false };

  next();
};

// @desc    Get current user rooms
// @route   GET /api/rooms/joined
// access   Private
export const getCurrentUserRooms = asyncHandler(async (req, res, next) => {
  const { page: pag, limit: lmt } = req.query;

  const page = Math.abs(parseInt(typeof pag === "string" ? pag : "1")) || 1;
  const limit = Math.abs(parseInt(typeof lmt === "string" ? lmt : "25")) || 25;

  const startIndex = (page - 1) * limit; // 0
  const endIndex = page * limit; // 25

  const user = req.user!;

  const pipeline: PipelineStage[] = [
    {
      $match: {
        memberId: user._id,
      },
    },
    {
      $lookup: {
        from: "rooms",
        localField: "roomId",
        foreignField: "_id",
        as: "roomId",
      },
    },
    { $unwind: { path: "$roomId" } },
    { $replaceRoot: { newRoot: "$roomId" } },
    { $sort: { updatedAt: -1 } },
  ];

  const [rooms, [{ total }]] = await Promise.all([
    Member.aggregate([...pipeline, { $limit: limit }, { $skip: startIndex }]),
    Member.aggregate([...pipeline, { $count: "total" }]) as Aggregate<
      [{ total: number }]
    >,
  ]);

  const pagination = {
    next: total > endIndex,
    prev: startIndex > 0,
    limit,
    page,
    pageSize: rooms.length,
    totalPages: Math.ceil(total / limit),
  };

  res.json({
    success: true,
    data: rooms,
    pagination,
    total,
  });
});

// @desc    Get single room
// @route   GET /api/rooms/:roomId
// access   Private
export const getRoom = (req: Req, res: Res, next: Next) => {
  res.status(200).json({
    success: true,
    data: req.room,
  });
};

// @desc    Create new room
// @route   POST /api/rooms
// access   Private
export const createRoom = asyncHandler(async (req, res, next) => {
  const { uploadedFile, members } = req.body;

  req.body.photo = uploadedFile?.url;
  req.body.roomOwner = req.user!._id;

  const room = await Room.create(req.body);

  let err;
  if (members) {
    err = await addMembers(members, String(req.user?._id), String(room._id));
  }

  res.status(201).json({
    success: true,
    data: room,
    message: `'${room.name}' room created${err ?? ""}`,
  });
});

const addMembers = async (members: unknown, userId: string, roomId: string) => {
  const membersToAdd: { memberId: string; roomId: string }[] = [];

  if (typeof members === "string" && members !== userId) {
    membersToAdd.push({ memberId: members, roomId });
  } else if (
    Array.isArray(members) &&
    members.every(m => typeof m === "string")
  ) {
    // Remove dublicate ids and owner id from the list
    const filteredMembers = Array.from(new Set(members)).filter(
      memberId => memberId !== userId
    );

    membersToAdd.push(
      ...filteredMembers.map(memberId => ({ memberId, roomId }))
    );
  } else {
    return ", but failed to add members";
  }

  await Member.create(membersToAdd);
};
