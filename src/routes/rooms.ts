import express from "express";
import multer from "multer";

import {
  createRoom,
  getAvailableRooms,
  addModerator,
  removeModerator,
  updateRoomInfo,
  updateRoomPhoto,
  getRoom,
} from "../controllers/rooms";

import advancedResults from "../middlewares/advancedResults";
import uploadFile from "../middlewares/uploadFile";
import { isAllowedToModifyRoom, checkRoomExistence } from "../middlewares/room";

import membersRoute from "./members";

const router = express.Router();
const upload = multer();

// Get all available rooms
router
  .route("/")
  .post(upload.single("photo"), uploadFile, createRoom)
  .get(getAvailableRooms, advancedResults);

// Find the room before continue
router.use("/:roomId", checkRoomExistence);

router
  .route("/:roomId")
  .get(getRoom) // Get single room
  .put(isAllowedToModifyRoom, updateRoomInfo); // Update room info (name, private, etc)

// Members route (Add, Remove, Get room members)
router.use("/:roomId/members", membersRoute);

// Update room's photo
router.put(
  "/:roomId/photo",
  isAllowedToModifyRoom,
  upload.single("photo"),
  uploadFile,
  updateRoomPhoto
);

// Add new moderator
router.put(
  "/:roomId/moderators/:moderatorId",
  isAllowedToModifyRoom,
  addModerator
);

// Remove moderator
router.delete(
  "/:roomId/moderators/:moderatorId",
  isAllowedToModifyRoom,
  removeModerator
);

export default router;
