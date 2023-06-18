import express from "express";
import multer from "multer";

import {
  addNewMessage,
  deleteMessage,
  getRoomMessages,
  getUnreadMessages,
  resetUnreadMessages,
  updateMessage,
} from "../controllers/messages";

import { advancedResults } from "../middlewares/advancedResults";
import uploadFile from "../middlewares/uploadFile";

const router = express.Router({ mergeParams: true });
const upload = multer();

// @route   /api/rooms/:roomId/messages
// @note    checkRoomExistence will add a room object on the rquest object

router
  .route("/")
  .get(getRoomMessages, advancedResults)
  .post(upload.single("file"), uploadFile, addNewMessage);

router.route("/:messageId").put(updateMessage).delete(deleteMessage);

router.get("/unread", getUnreadMessages);
router.post("/unread", resetUnreadMessages);

export default router;
