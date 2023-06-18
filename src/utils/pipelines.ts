import { ObjectId, PipelineStage } from "mongoose";

export const currentUserRoomsPipeline = (
  userId: ObjectId | string
): PipelineStage[] => [
  {
    $lookup: {
      from: "members",
      localField: "_id",
      foreignField: "roomId",
      as: "myRooms",
      pipeline: [
        {
          $match: {
            memberId: userId,
          },
        },
      ],
    },
  },
  { $unwind: { path: "$myRooms" } },
  {
    $lookup: {
      from: "messages",
      localField: "lastMessage",
      foreignField: "_id",
      as: "lastMessage",
      pipeline: [
        {
          $lookup: {
            from: "users",
            localField: "senderId",
            foreignField: "_id",
            as: "senderId",
          },
        },
        {
          $unwind: {
            path: "$senderId",
            preserveNullAndEmptyArrays: true,
          },
        },
      ],
    },
  },
  {
    $unwind: { path: "$lastMessage", preserveNullAndEmptyArrays: true },
  },
  { $unset: "myRooms" },
  { $sort: { updatedAt: -1 } },
];

export const availableRoomsPipeline = (
  userId: ObjectId | string
): PipelineStage[] => [
  { $match: { private: false } },
  {
    $lookup: {
      from: "members",
      localField: "_id",
      foreignField: "roomId",
      as: "isMember",
      pipeline: [
        {
          $match: {
            memberId: userId,
          },
        },
      ],
    },
  },
  {
    $unwind: {
      path: "$isMember",
      preserveNullAndEmptyArrays: true,
    },
  },
  { $match: { isMember: null } },
  { $sort: { createdAt: -1 } },
];
