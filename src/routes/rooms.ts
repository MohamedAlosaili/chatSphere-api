import express from "express";
import multer from "multer";

import {
  createRoom,
  getAvailableRooms,
  getRoom,
  getCurrentUserRooms,
} from "../controllers/rooms";

import advancedResults from "../middlewares/advancedResults";
import uploadFile from "../middlewares/uploadFile";
import { isRoomOwner, checkRoomExistence } from "../middlewares/room";

import membersRoute from "./members";
import roomOwnerRoute from "./roomOwner";
import messagesRoute from "./messages";

const router = express.Router();
const upload = multer();

// Get all available rooms
router
  .route("/")
  .post(upload.single("photo"), uploadFile, createRoom)
  .get(getAvailableRooms, advancedResults);

// Get currentUser rooms
router.get("/joined", getCurrentUserRooms);

// Find the room before continue or response with error
router.use("/:roomId", checkRoomExistence);

// Get single room
router.route("/:roomId").get(getRoom);

// Subroutes of room route
router.use("/:roomId/members", membersRoute);
router.use("/:roomId/messages", messagesRoute);
router.use("/:roomId/owner", isRoomOwner, roomOwnerRoute);

export default router;
