import express from "express";

import {
  allUsers,
  availableRooms,
  currentUserRooms,
} from "../controllers/search";

import {
  advancedAggregateResults,
  advancedResults,
} from "../middlewares/advancedResults";

const router = express.Router();

router.get("/users", allUsers, advancedResults);
router.get("/rooms", availableRooms, advancedAggregateResults);
router.get("/rooms/joined", currentUserRooms, advancedAggregateResults);

export default router;
