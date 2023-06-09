import express from "express";

import { getRoomMembers, joinRoom } from "../controllers/members";

import advancedResults from "../middlewares/advancedResults";

const router = express.Router({ mergeParams: true });

// @route   /api/rooms/:roomId/members
// @note    checkRoomExistence will add a room object on the rquest object

router.route("/").get(getRoomMembers, advancedResults);

router.post("/join", joinRoom);

export default router;
