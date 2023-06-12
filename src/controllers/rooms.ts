import { Aggregate, PipelineStage } from "mongoose";

import Room from "../models/Room";
import Member from "../models/Member";

import asyncHandler from "../middlewares/asyncHandler";
import validMembersToAdd from "../utils/validMembersToAdd";

// Types
import { Next, Req, Res } from "../types";

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
        pipeline: [
          {
            $lookup: {
              from: "messages",
              localField: "lastMessage",
              foreignField: "_id",
              as: "lastMessage",
            },
          },
          {
            $unwind: { path: "$lastMessage", preserveNullAndEmptyArrays: true },
          },
        ],
      },
    },
    { $unwind: { path: "$roomId" } },
    { $replaceRoot: { newRoot: "$roomId" } },
    { $sort: { updatedAt: -1 } },
  ];

  const [rooms, countDocuments] = await Promise.all([
    Member.aggregate([...pipeline, { $limit: limit }, { $skip: startIndex }]),
    Member.aggregate([...pipeline, { $count: "total" }]) as Aggregate<
      [{ total: number }]
    >,
  ]);

  const total = countDocuments?.[0]?.total ?? 0;

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
  const { uploadedFile, members, ...body } = req.body;

  body.photo = uploadedFile?.url;
  body.roomOwner = req.user!._id;
  console.log(body, members);

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
