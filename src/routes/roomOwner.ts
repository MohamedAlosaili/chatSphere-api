import express from "express";
import multer from "multer";

import {
  addMembers,
  addModerator,
  removeMembers,
  removeModerator,
  updateRoomInfo,
  updateRoomPhoto,
} from "../controllers/roomOwner";

import uploadFile from "../middlewares/uploadFile";

const router = express.Router({ mergeParams: true });
const upload = multer();

// @route   /api/rooms/:roomId/owner
// @note    checkRoomExistence will add a room object on the rquest object

// Update room info (name, private, etc)
router.put("/", updateRoomInfo);

// Update room's photo
router.put("/photo", upload.single("photo"), uploadFile, updateRoomPhoto);

// Add/Remove moderators
router.post("/moderators/add", addModerator);
router.post("/moderators/remove", removeModerator);

// Add/Remove members
router.post("/members/add", addMembers);
router.post("/members/remove", removeMembers);

export default router;
